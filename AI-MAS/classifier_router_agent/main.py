from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
import os
import smtplib
import imaplib
import email
from email.message import EmailMessage
import traceback
import pickle
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import torch.nn.functional as F
from shared.database import log_routing, get_connection
from typing import Optional

# Load models and configurations
model_dir = Path("classifier_router_agent/bert_model")
model = BertForSequenceClassification.from_pretrained(model_dir)
tokenizer = BertTokenizer.from_pretrained(model_dir)
with open("classifier_router_agent/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)
model.eval()

from dotenv import load_dotenv
load_dotenv()

# Email settings
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
EMAIL_HOST = "imap.gmail.com"
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")

BASE_FOLDER = Path("data/incoming_docs").resolve()
DEPARTMENT_EMAILS = {
    "hr": "eyesmashh@gmail.com",
    "finance": "finance@example.com",
    "legal": "legal@example.com",
    "marketing": "marketing@example.com",
    "other": "other@example.com"
}

class RouteRequest(BaseModel):
    folder: str
    email_uid: Optional[str] = None

app = FastAPI()

def forward_original_email(uid: str, recipient: str, classification_label: str, confidence: float):
    """
    Fetches an email by its UID, modifies its headers, and forwards the full email.
    """
    try:
        mail = imaplib.IMAP4_SSL(EMAIL_HOST)
        mail.login(EMAIL_USER, EMAIL_PASS)
        mail.select("inbox")
        _, data = mail.fetch(uid, "(RFC822)")
        mail.logout()

        original_msg = email.message_from_bytes(data[0][1])

        # Modify headers
        original_subject = original_msg['Subject']
        for header in ["Subject", "To", "From"]:
            if header in original_msg:
                del original_msg[header]

        original_msg['From'] = f"Automated System <{EMAIL_USER}>"
        original_msg['To'] = recipient
        original_msg['Subject'] = f"Fwd: {original_subject} - Classified as {classification_label.upper()} ({confidence:.2f})"

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [recipient], original_msg.as_string())

        print(f"Successfully forwarded email UID {uid} to {recipient}")

    except Exception as e:
        print(f"Failed to forward email UID {uid}. Error: {traceback.format_exc()}")
        raise e

@app.post("/classify-and-route")
async def classify_and_route(request: RouteRequest):
    folder_path = Path(request.folder).resolve()
    if not folder_path.exists():
        raise HTTPException(status_code=404, detail="Folder not found")

    extracted_file = folder_path / "extracted.txt"
    if not extracted_file.exists():
        extracted_file = folder_path / "body.txt"
    if not extracted_file.exists():
        raise HTTPException(status_code=404, detail="No content file found for classification")

    content = extracted_file.read_text(encoding="utf-8")

    try:
        inputs = tokenizer(content, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)
            probs = F.softmax(outputs.logits, dim=1)[0]
            confidence, pred_idx = torch.max(probs, dim=0)
            predicted_label = label_encoder.inverse_transform([pred_idx.item()])[0]
            confidence = confidence.item()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {e}")

    recipient = ADMIN_EMAIL if confidence < 0.4 else DEPARTMENT_EMAILS.get(predicted_label, DEPARTMENT_EMAILS["other"])

    try:
        if request.email_uid:
            forward_original_email(request.email_uid, recipient, predicted_label, confidence)
        else:
            subject_line = f"Routed Document - {predicted_label.upper()} ({confidence:.2f})"
            msg = EmailMessage()
            msg["Subject"] = subject_line
            msg["From"] = EMAIL_USER
            msg["To"] = recipient
            msg.set_content(content[:4000])
            for file in folder_path.iterdir():
                if file.name not in ["extracted.txt", "entities.txt"]:
                    with open(file, "rb") as f:
                        msg.add_attachment(f.read(), maintype="application", subtype="octet-stream", filename=file.name)
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASS)
                server.send_message(msg)

        status = "unprocessed" if recipient == ADMIN_EMAIL else "processed"
        log_routing(str(folder_path), predicted_label, round(confidence, 4), recipient, status)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email routing failed: {e}")

    return {
        "status": "Classification and routing complete",
        "category": predicted_label,
        "confidence": round(confidence, 4),
        "routed_to": recipient
    }

@app.get("/unprocessed-mails")
def get_unprocessed_mails():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""SELECT folder_path, category, confidence, recipient, timestamp
                          FROM routing_log WHERE status = 'unprocessed'
                          ORDER BY timestamp DESC""")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return [
            {
                "folder_path": row[0],
                "category": row[1],
                "confidence": row[2],
                "recipient": row[3],
                "timestamp": row[4].isoformat()
            }
            for row in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
