import os

class Config:
    UPLOAD_FOLDER = "uploads"
    SUBMITTED_DIR = os.path.join(UPLOAD_FOLDER, "submitted_docs")
    DIGILOCKER_DIR = os.path.join(UPLOAD_FOLDER, "digilocker_docs")
    OUTPUT_DIR = os.path.join(UPLOAD_FOLDER, "comparison_results")
    ALLOWED_EXTENSIONS = {"pdf", "zip"}
    CREDENTIAL_PATH = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS",
        os.path.join(os.path.dirname(__file__), "..", "industrial-net-477410-a1-41426c2aeb41.json")
    )
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

