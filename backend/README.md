# Document Verification Backend API

Flask REST API server for document verification system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Google Cloud credentials:
   - Place your Google Cloud Vision credentials JSON file in the project root
   - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
   - Set `GEMINI_API_KEY` environment variable

3. Install system dependencies (for pdf2image):
   - Ubuntu/Debian: `sudo apt-get install poppler-utils`
   - macOS: `brew install poppler`
   - Windows: Download poppler binaries and add to PATH

## Running the Server

```bash
python app.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Authentication
- `POST /api/login` - Login endpoint
  ```json
  {
    "username": "hr",
    "password": "hr123",
    "userType": "hr"
  }
  ```

### File Upload
- `POST /api/upload` - Upload candidate documents (multipart/form-data)
  - Form field: `files` (multiple PDF files)
  - Form field: `candidateId` (optional, defaults to cand_0001)

- `POST /api/upload-digilocker` - Upload DigiLocker ZIP (multipart/form-data)
  - Form field: `file` (ZIP file)
  - Form field: `candidateId` (optional)

### Document Comparison
- `POST /api/compare` - Compare documents for a candidate
  ```json
  {
    "candidateId": "cand_0001"
  }
  ```

### Get Results
- `GET /api/candidates` - Get all candidate results
- `GET /api/candidates/<candidate_id>` - Get specific candidate result

## Environment Variables

- `GOOGLE_APPLICATION_CREDENTIALS` - Path to Google Cloud credentials JSON
- `GEMINI_API_KEY` - Google Gemini API key

