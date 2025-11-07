import os
import json
import zipfile
import logging
import tempfile
import uuid
import threading
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from .services import allowed_file, compare_pdfs
from .config import Config

api = Blueprint('api', __name__)

TASKS_FILE = os.path.join(os.path.dirname(__file__), "tasks.json")

def get_tasks():
    if not os.path.exists(TASKS_FILE):
        return {}
    with open(TASKS_FILE, 'r') as f:
        return json.load(f)

def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

def run_comparison(task_id, candidate_id):
    """The actual comparison logic that runs in a background thread."""
    try:
        tasks = get_tasks()
        tasks[task_id] = {"status": "in_progress", "result": None}
        save_tasks(tasks)
        
        sub_dir = os.path.join(Config.SUBMITTED_DIR, candidate_id)
        
        # Hardcoded DigiLocker zip path
        hardcoded_zip_path = "/home/karthick/Downloads/cand0002.zip"
        
        if not os.path.exists(hardcoded_zip_path):
            raise FileNotFoundError(f"Hardcoded zip file not found at {hardcoded_zip_path}")

        digi_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(hardcoded_zip_path, 'r') as zip_ref:
            zip_ref.extractall(digi_dir)

        # Check for subdirectory
        extracted_items = os.listdir(digi_dir)
        if len(extracted_items) == 1 and os.path.isdir(os.path.join(digi_dir, extracted_items[0])):
            digi_dir = os.path.join(digi_dir, extracted_items[0])

        if not os.path.exists(sub_dir):
            raise FileNotFoundError(f"Submitted docs not found for candidate {candidate_id} at {sub_dir}")

        logging.info(f"Submitted docs found at {sub_dir}: {os.listdir(sub_dir)}")
        logging.info(f"DigiLocker docs found at {digi_dir}: {os.listdir(digi_dir)}")

        result = {"Candidate": candidate_id, "Documents": []}

        for fname in os.listdir(sub_dir):
            if not fname.lower().endswith(".pdf"):
                continue

            path1 = os.path.join(sub_dir, fname)
            path2 = os.path.join(digi_dir, fname)
            if not os.path.exists(path2):
                result["Documents"].append({
                    "Document_Name": fname,
                    "Differences": "Missing in DigiLocker",
                    "Details": [{"Field": "N/A", "Reason": "No matching file"}]
                })
                continue

            comp = compare_pdfs(path1, path2)
            result["Documents"].append(comp)

        output_path = os.path.join(Config.OUTPUT_DIR, f"{candidate_id}_comparison.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=4, ensure_ascii=False)
        
        tasks = get_tasks()
        tasks[task_id] = {"status": "completed", "result": result}
        save_tasks(tasks)

    except Exception as e:
        logging.error(f"Task {task_id} failed: {e}")
        tasks = get_tasks()
        tasks[task_id] = {"status": "failed", "result": str(e)}
        save_tasks(tasks)


@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "API running"}), 200

@api.route("/login", methods=["POST"])
def login():
    data = request.json
    logging.info(f"Login attempt: {data}")
    username = data.get("username")
    password = data.get("password")
    user_type = data.get("userType", "user")

    if user_type == "hr" and username == "hr" and password == "hr123":
        return jsonify({
            "success": True,
            "user": username,
            "userType": "hr",
            "token": "demo_token_hr"
        })
    elif user_type == "user" and username and password:
        return jsonify({
            "success": True,
            "user": username,
            "userType": "user",
            "token": f"demo_token_{username}"
        })
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@api.route("/upload", methods=["POST"])
def upload_docs():
    if "files" not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    candidate_id = request.form.get("candidateId", "cand_0001")
    candidate_dir = os.path.join(Config.SUBMITTED_DIR, candidate_id)
    os.makedirs(candidate_dir, exist_ok=True)

    uploaded = []
    for file in request.files.getlist("files"):
        if file and file.filename.endswith('.zip'):
            zip_path = os.path.join(candidate_dir, secure_filename(file.filename))
            file.save(zip_path)
            with zipfile.ZipFile(zip_path, "r") as z:
                for f in z.namelist():
                    if f.lower().endswith(".pdf"):
                        z.extract(f, candidate_dir)
                        uploaded.append(f)
            os.remove(zip_path) # remove the zip file after extraction

    return jsonify({"success": True, "files": uploaded, "candidateId": candidate_id})

@api.route("/upload-digilocker", methods=["POST"])
def upload_digilocker():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    candidate_id = request.form.get("candidateId", "cand_0001")

    if not file.filename.endswith(".zip"):
        return jsonify({"error": "Expected a .zip file"}), 400

    candidate_dir = os.path.join(Config.DIGILOCKER_DIR, candidate_id)
    os.makedirs(candidate_dir, exist_ok=True)

    zip_path = os.path.join(candidate_dir, secure_filename(file.filename))
    file.save(zip_path)

    extract_dir = os.path.join(candidate_dir, "extracted")
    os.makedirs(extract_dir, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as z:
        for f in z.namelist():
            if f.lower().endswith(".pdf"):
                z.extract(f, extract_dir)

    return jsonify({"success": True, "message": "ZIP extracted", "candidateId": candidate_id})

@api.route("/compare", methods=["POST"])
def compare_documents_async():
    data = request.json
    candidate_id = data.get("candidateId")
    if not candidate_id:
        return jsonify({"error": "candidateId is required"}), 400

    task_id = str(uuid.uuid4())
    tasks = get_tasks()
    tasks[task_id] = {"status": "pending", "result": None}
    save_tasks(tasks)
    
    thread = threading.Thread(target=run_comparison, args=(task_id, candidate_id))
    thread.start()
    
    return jsonify({"task_id": task_id}), 202

@api.route("/status/<task_id>", methods=["GET"])
def get_status(task_id):
    tasks = get_tasks()
    task = tasks.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task)

@api.route("/candidates", methods=["GET"])
def get_all_candidates():
    results = []
    if os.path.exists(Config.OUTPUT_DIR):
        for f in os.listdir(Config.OUTPUT_DIR):
            if f.endswith("_comparison.json"):
                try:
                    with open(os.path.join(Config.OUTPUT_DIR, f), "r", encoding="utf-8") as jf:
                        results.append(json.load(jf))
                except Exception as e:
                    logging.warning(f"Read error {f}: {e}")
    return jsonify(results)

@api.route("/candidates/<cid>", methods=["GET"])
def get_candidate(cid):
    path = os.path.join(Config.OUTPUT_DIR, f"{cid}_comparison.json")
    if not os.path.exists(path):
        return jsonify({"error": "Candidate not found"}), 404
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
