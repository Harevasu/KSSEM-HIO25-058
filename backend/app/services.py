import os
import json
import tempfile
import shutil
import logging
from pdf2image import convert_from_path
import google.generativeai as genai
from google.cloud import vision
from werkzeug.utils import secure_filename
from .config import Config

# Initialize Google clients
try:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = Config.CREDENTIAL_PATH
    if not Config.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    genai.configure(api_key=Config.GEMINI_API_KEY)
    
    vision_client = vision.ImageAnnotatorClient()
    generative_model = genai.GenerativeModel("models/gemini-2.5-flash")
except Exception as e:
    logging.error(f"Google API initialization failed: {e}")
    vision_client = None
    generative_model = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def vision_ocr_pdf(pdf_path):
    """Extract text from a PDF using Google Vision API"""
    if not vision_client:
        return "Error: Vision client not initialized."
    try:
        pages = convert_from_path(pdf_path, dpi=300)
        text_output = []
        tmp_dir = tempfile.mkdtemp()

        for i, page in enumerate(pages):
            img_path = os.path.join(tmp_dir, f"page_{i}.jpg")
            page.save(img_path, "JPEG")
            with open(img_path, "rb") as f:
                image = vision.Image(content=f.read())
            resp = vision_client.document_text_detection(image=image)
            text_output.append(resp.full_text_annotation.text)

        shutil.rmtree(tmp_dir)
        return "\n".join(text_output)
    except Exception as e:
        logging.error(f"OCR failed for {pdf_path}: {e}")
        return f"Error: {str(e)}"

def extract_json_from_text(ocr_text):
    """Generate structured JSON using Gemini"""
    if not generative_model:
        return {"Error": "Generative model not initialized."}
        
    BASE_PROMPT = """
    You are a structured-data extractor for document verification.
    Identify document type and extract fields into JSON using provided schema.
    Output ONLY valid JSON.
    """

    try:
        prompt = BASE_PROMPT + "\n\nOCR TEXT:\n" + ocr_text[:10000]
        resp = generative_model.generate_content(prompt)
        text = resp.text.strip().replace("```json", "").replace("```", "")
        return json.loads(text)
    except Exception as e:
        logging.error(f"Gemini parse error: {e}")
        return {"Error": str(e), "RawText": ocr_text[:300]}

def verifier(pdf_path):
    """Run OCR and data extraction"""
    ocr_text = vision_ocr_pdf(pdf_path)
    return extract_json_from_text(ocr_text)

def compare_pdfs(pdf_path1, pdf_path2):
    """Compare two PDFs via Gemini"""
    if not generative_model:
        return {
            "Document_Name": os.path.basename(pdf_path1),
            "Differences": "Error",
            "Details": [{"Field": "N/A", "Reason": "Generative model not initialized."}]
        }

    logging.info(f"Comparing {pdf_path1} and {pdf_path2}")
    json1 = verifier(pdf_path1)
    json2 = verifier(pdf_path2)

    json1_for_prompt = json1.get("extracted_data", json1)
    json2_for_prompt = json2.get("extracted_data", json2)

    COMPARE_PROMPT = f"""
    Compare two JSONs representing the same document.
    Ignore case/spacing differences and return only meaningful mismatches.
    Return strictly valid JSON in this format:
    {{
      "Document_Name": "<document>",
      "Differences": "Yes" or "No",
      "Details": [{{"Field": "<field>", "Reason": "<explanation>"}}]
    }}

    JSON 1:
    {json.dumps(json1_for_prompt, indent=2)}
    JSON 2:
    {json.dumps(json2_for_prompt, indent=2)}
    """
    logging.info(f"Gemini Compare Prompt: {COMPARE_PROMPT}")

    try:
        resp = generative_model.generate_content(COMPARE_PROMPT)
        logging.info(f"Gemini Compare Response: {resp.text}")
        text = resp.text.strip().replace("```json", "").replace("```", "")
        comparison_result = json.loads(text)
        comparison_result['Details'] = [dict(d, Json1=json1, Json2=json2) for d in comparison_result.get('Details', [])]
        return comparison_result
    except Exception as e:
        logging.error(f"Comparison error: {e}")
        return {
            "Document_Name": os.path.basename(pdf_path1),
            "Differences": "Error",
            "Details": [{"Field": "N/A", "Reason": str(e), "Json1": json1, "Json2": json2}]
        }
