from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
import os
import smtplib
from email.message import EmailMessage
import pickle
import traceback

# Load trained classifier and vectorizer
model_path = Path("classifier_router_agent/models")
with open(model_path / "classifier_model.pkl", "rb") as f:
    classifier = pickle.load(f)
with open(model_path / "vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# Email configuration
from dotenv import load_dotenv
load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")

BASE_FOLDER = Path("data/incoming_docs").resolve()

# Department routing
DEPARTMENT_EMAILS = {
    "hr": "eyesmashh@gmail.com",
    "finance": "cooliebrozz@gmail.com",
    "legal": "vtu29711@veltech.edu.in",
    "marketing": "vtu21711@veltech.edu.in",
    "other": "vtu23579@veltech.edu.in"
}

# API input model
class RouteRequest(BaseModel):
    folder: str

app = FastAPI()

@app.post("/classify-and-route")
async def classify_and_route(request: RouteRequest):
    folder_path = Path(request.folder).resolve()

    # Validate folder and file existence
    if not folder_path.exists() or not (BASE_FOLDER in folder_path.parents or BASE_FOLDER == folder_path):
        raise HTTPException(status_code=404, detail="Folder not found")

    extracted_file = folder_path / "extracted.txt"
    if not extracted_file.exists():
        raise HTTPException(status_code=404, detail="extracted.txt not found")

    content = extracted_file.read_text(encoding="utf-8")

    try:
        # Predict category and confidence
        X = vectorizer.transform([content])
        predicted_proba = classifier.predict_proba(X)[0]
        predicted_label = classifier.classes_[predicted_proba.argmax()]
        confidence = predicted_proba.max()

        print(f"Predicted: {predicted_label}, Confidence: {confidence:.2f}")

    except Exception as e:
        print("Classification error:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Classification failed: {e}")

    # Determine recipient and subject
    if confidence < 0.6:
        recipient = ADMIN_EMAIL
        subject_line = f"[MANUAL REVIEW] Uncertain Classification - {predicted_label.upper()} ({confidence:.2f})"
    else:
        recipient = DEPARTMENT_EMAILS.get(predicted_label, DEPARTMENT_EMAILS["other"])
        subject_line = f"Routed Document - {predicted_label.upper()} ({confidence:.2f})"

    # Send email with attachments
    try:
        msg = EmailMessage()
        msg["Subject"] = subject_line
        msg["From"] = EMAIL_USER
        msg["To"] = recipient
        msg.set_content(content[:4000])  # Email body

        for file in folder_path.iterdir():
            if file.name == "extracted.txt":
                continue
            with open(file, "rb") as f:
                msg.add_attachment(
                    f.read(),
                    maintype="application",
                    subtype="octet-stream",
                    filename=file.name
                )

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

    except Exception as e:
        print("Routing error:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Email routing failed: {e}")

    return {
        "status": "Classification and routing complete",
        "category": predicted_label,
        "confidence": confidence,
        "routed_to": recipient
    }
