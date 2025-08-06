# start_all.py
import requests

def process_document(file_path):
    # Step 1: Ingest
    with open(file_path, "rb") as f:
        r = requests.post("http://localhost:8001/ingest", files={"file": f})
        filename = r.json()["metadata"]["filename"]

    # Step 2: Extract
    r = requests.post("http://localhost:8002/extract", json={"filename": filename})
    text = r.json()["text"]

    # Step 3: Classify
    r = requests.post("http://localhost:8003/classify", json={"text": text})
    category = r.json()["category"]

    # Step 4: Route
    r = requests.post("http://localhost:8004/route", json={"category": category})
    return r.json()


