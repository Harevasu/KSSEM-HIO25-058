# Automated Document Verification System

This project provides an end-to-end **document verification pipeline** for candidate-submitted documents. It combines **OCR, AI-based structured extraction, face verification**, and **comparison against reference documents** to ensure authenticity.

---

## **Features**

1. **OCR and Structured Data Extraction**
   - Converts PDFs to images and extracts text using **Google Vision OCR**.
   - Uses **Google Gemini AI** to extract structured JSON fields for multiple document types:
     - Aadhaar Card
     - PAN Card
     - Passport
     - 10th, 11th, 12th Certificates
     - College Degrees

2. **Face Verification**
   - Uses **DeepFace** to compare candidate photos on submitted documents against reference photos.
   - Detects mismatches and flags them in the verification output.

3. **Document Comparison**
   - Compares submitted documents with reference/mock DigiLocker documents.
   - Ignores formatting differences, minor typos, and structural variations.
   - Focuses on **semantic differences** (e.g., mismatched DOB, total marks, missing documents).

4. **Batch Processing**
   - Automatically processes multiple candidates.
   - Generates per-document and per-candidate JSON verification outputs.

5. **Front-End Integration**
   - Web interface available for uploading ZIP files and viewing results.

---

## **Workflow**

1. **Document Upload**
   - **Option 1:** HR uploads multiple candidates’ documents in a **ZIP file** (mass processing).  
   - **Option 2:** Candidates upload documents themselves via the front-end portal, triggering **automatic verification**.

2. **PDF Extraction**
   - Extract PDFs from uploaded ZIP files into a structured directory.

3. **OCR Extraction**
   - Convert PDFs to images and extract text using **Google Vision API**.

4. **JSON Extraction**
   - Use **Gemini AI** to extract structured JSON fields based on document type.

5. **Face Verification**
   - Compare candidate photos using **DeepFace** against reference photos.

6. **Document Comparison**
   - Compare extracted JSON with reference/mock documents.
   - Identify **real differences** while ignoring formatting and minor variations.

7. **Output Generation**
   - Produce per-document and per-candidate JSON verification reports.

8. **Front-End Display**
   - Results are viewable on the web interface, with details on mismatches or flagged documents.

---

## **JSON Output Example**

```json
{
  "Candidate": "John Doe",
  "Documents": [
    {
      "Document_Name": "12th_certificate.pdf",
      "Differences": "No",
      "Details": []
    },
    {
      "Document_Name": "Aadhaar.pdf",
      "Differences": "Yes",
      "Details": [
        {
          "Field": "Photo_ID",
          "Reason": "Candidate photo does not match reference."
        }
      ]
    }
  ]
}
```
