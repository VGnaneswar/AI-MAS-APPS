from fastapi import FastAPI, UploadFile, File, HTTPException
from shared.database import get_connection, init_db
from pathlib import Path
import os
import imaplib
import email
from email.header import decode_header
import re
import pytesseract
from PIL import Image
import fitz
import docx2txt
import spacy
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

load_dotenv()
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
EMAIL_HOST = "imap.gmail.com"

app = FastAPI()

INCOMING_DOCS_DIR = Path("data/incoming_docs")
INCOMING_DOCS_DIR.mkdir(parents=True, exist_ok=True)

nlp = spacy.load("en_core_web_sm")

try:
    init_db()
except Exception as e:
    print(f"Database initialization failed: {e}")
    raise

def clean_filename(name):
    return re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", name).strip()

def extract_text(folder_path: Path):
    extracted_text = ""
    for file in folder_path.iterdir():
        if file.suffix in [".txt", ".html"]:
            extracted_text += file.read_text(errors="ignore") + "\n\n"
        elif file.suffix == ".pdf":
            doc = fitz.open(file)
            for page in doc:
                extracted_text += page.get_text()
        elif file.suffix == ".docx":
            extracted_text += docx2txt.process(str(file))
        elif file.suffix in [".png", ".jpg", ".jpeg"]:
            img = Image.open(file)
            text = pytesseract.image_to_string(img)
            extracted_text += f"\n\n[OCR from {file.name}]:\n{text}"
    return extracted_text

@app.get("/health")
def health():
    return {"status": "Ingestor-Extractor agent running"}

@app.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    file_path = INCOMING_DOCS_DIR / file.filename
    try:
        content = await file.read()
        if file_path.exists():
            raise HTTPException(status_code=400, detail="File already exists")
        with open(file_path, "wb") as f:
            f.write(content)
        doc_type = "document" if file.filename.lower().endswith((".pdf", ".docx")) else \
                   "image" if file.filename.lower().endswith((".jpg", ".jpeg", ".png")) else "other"
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO documents (filename, size, document_type) VALUES (%s, %s, %s)",
                (file.filename, len(content), doc_type)
            )
            conn.commit()
        folder_path = INCOMING_DOCS_DIR / file.filename.split('.')[0]
        folder_path.mkdir(parents=True, exist_ok=True)
        with open(folder_path / file.filename, "wb") as f:
            f.write(content)
        extracted = extract_text(folder_path)
        with open(folder_path / "extracted.txt", "w", encoding="utf-8") as f:
            f.write(extracted)
        doc = nlp(extracted)
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        with open(folder_path / "entities.txt", "w", encoding="utf-8") as f:
            for ent, label in entities:
                f.write(f"{ent} ({label})\n")
        try:
            requests.post("http://localhost:8003/classify-and-route", json={"folder": str(folder_path.resolve())})
        except Exception as e:
            print(f"Classifier-router trigger failed: {e}")
        return {"status": "Upload + Extraction complete"}
    except Exception as e:
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest-from-email")
def ingest_from_email():
    if not EMAIL_USER or not EMAIL_PASS:
        raise HTTPException(status_code=500, detail="Missing email credentials")
    try:
        mail = imaplib.IMAP4_SSL(EMAIL_HOST)
        mail.login(EMAIL_USER, EMAIL_PASS)
        mail.select("inbox")
        status, messages = mail.search(None, '(UNSEEN)')
        email_ids = messages[0].split()
        print(f"Found {len(email_ids)} unread emails")
        for i in email_ids[-5:]:
            print(f"Fetching email ID: {i.decode()}")
            _, data = mail.fetch(i, "(RFC822)")
            msg = email.message_from_bytes(data[0][1])
            subject_raw, encoding = decode_header(msg["Subject"] or "no-subject")[0]
            try:
                subject = subject_raw.decode(encoding or "utf-8") if isinstance(subject_raw, bytes) else subject_raw
            except Exception:
                subject = "no-subject"
            clean_subject = clean_filename(subject[:40])
            folder_name = f"{i.decode()}_{clean_subject}"
            folder_path = INCOMING_DOCS_DIR / folder_name
            folder_path.mkdir(parents=True, exist_ok=True)
            print(f"Created folder: {folder_path}")
            body_saved = False
            for part in msg.walk():
                if part.get_content_type() == "text/plain" and part.get_content_disposition() is None and not body_saved:
                    body_text = part.get_payload(decode=True)
                    if body_text:
                        with open(folder_path / "body.txt", "wb") as f:
                            f.write(body_text)
                        print(f"Saved body to {folder_path / 'body.txt'}")
                        body_saved = True
            if not body_saved:
                for part in msg.walk():
                    if part.get_content_type() == "text/html" and part.get_content_disposition() is None:
                        html_body = part.get_payload(decode=True)
                        if html_body:
                            with open(folder_path / "body.html", "wb") as f:
                                f.write(html_body)
                            print(f"Saved HTML body to {folder_path / 'body.html'}")
                            break
            for part in msg.walk():
                if part.get_content_disposition() == "attachment":
                    filename = part.get_filename()
                    if filename:
                        decoded_filename, enc = decode_header(filename)[0]
                        try:
                            filename = decoded_filename.decode(enc or 'utf-8') if isinstance(decoded_filename, bytes) else decoded_filename
                        except Exception:
                            filename = "unknown_file"
                        filepath = folder_path / clean_filename(filename)
                        with open(filepath, "wb") as f:
                            f.write(part.get_payload(decode=True))
                        print(f"Saved attachment: {filepath}")
                        doc_type = "document" if filename.lower().endswith((".pdf", ".docx")) else \
                                   "image" if filename.lower().endswith((".jpg", ".png")) else "other"
                        with get_connection() as conn:
                            cursor = conn.cursor()
                            cursor.execute(
                                "INSERT INTO documents (filename, size, document_type) VALUES (%s, %s, %s)",
                                (filepath.name, os.path.getsize(filepath), doc_type)
                            )
                            conn.commit()
            extracted = extract_text(folder_path)
            with open(folder_path / "extracted.txt", "w", encoding="utf-8") as f:
                f.write(extracted)
            doc = nlp(extracted)
            entities = [(ent.text, ent.label_) for ent in doc.ents]
            with open(folder_path / "entities.txt", "w", encoding="utf-8") as f:
                for ent, label in entities:
                    f.write(f"{ent} ({label})\n")
            try:
                requests.post("http://localhost:8003/classify-and-route", json={"folder": str(folder_path.resolve())})
                print(f"Triggered classifier-router for {folder_path}")
            except Exception as e:
                print(f"Failed to trigger classifier-router: {e}")
        return {"status": "Email ingestion complete"}
    except Exception as e:
        print(f"Error during email ingestion: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
def get_documents():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, filename, size, uploaded_at, document_type FROM documents")
        return {"documents": cursor.fetchall()}

def schedule_ingestion():
    print("Running scheduled ingestion...")
    try:
        ingest_from_email()
    except Exception as e:
        print(f"Scheduled ingestion failed: {e}")

scheduler = BackgroundScheduler()
scheduler.add_job(schedule_ingestion, "interval", minutes=1)
scheduler.start()
