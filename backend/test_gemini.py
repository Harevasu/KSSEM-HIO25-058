import os
from dotenv import load_dotenv
import google.generativeai as genai

def test_gemini_api():
    """Tests the Gemini API with a simple prompt."""
    print("Testing Gemini API...")
    try:
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("GEMINI_API_KEY not found in .env file.")
            return

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        
        prompt = "Hello, Gemini! Are you working?"
        print(f"Sending prompt: '{prompt}'")
        
        response = model.generate_content(prompt)
        
        print("Gemini API response received:")
        print(response.text)
        print("\nGemini API test PASSED!")

    except Exception as e:
        print(f"Gemini API test FAILED: {e}")

if __name__ == "__main__":
    test_gemini_api()
