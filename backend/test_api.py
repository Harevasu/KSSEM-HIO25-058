import requests
import json
import os
import time

BASE_URL = "http://localhost:5000/api"

def test_health():
    print("Testing GET /api/health...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        response.raise_for_status()
        print("Health check PASSED")
        print(response.json())
    except Exception as e:
        print(f"Health check FAILED: {e}")

def test_login():
    print("\nTesting POST /api/login...")
    try:
        # Test user login
        print("Testing user login...")
        response = requests.post(f"{BASE_URL}/login", json={"username": "testuser", "password": "password", "userType": "user"})
        response.raise_for_status()
        assert response.json()["success"] == True
        print("User login PASSED")

        # Test HR login
        print("Testing HR login...")
        response = requests.post(f"{BASE_URL}/login", json={"username": "hr", "password": "hr123", "userType": "hr"})
        response.raise_for_status()
        assert response.json()["success"] == True
        print("HR login PASSED")
    except Exception as e:
        print(f"Login test FAILED: {e}")

def test_upload_and_compare():
    print("\nTesting upload and compare...")
    try:
        # Create a dummy zip file for upload
        if not os.path.exists("test_docs"):
            os.makedirs("test_docs")
        with open("test_docs/test_doc.pdf", "w") as f:
            f.write("This is a test pdf.")
        with zipfile.ZipFile("test_docs.zip", 'w') as z:
            z.write("test_docs/test_doc.pdf")

        # Test upload
        print("Testing POST /api/upload...")
        with open("test_docs.zip", "rb") as f:
            files = {'files': f}
            response = requests.post(f"{BASE_URL}/upload", files=files, data={"candidateId": "test_candidate"})
            response.raise_for_status()
            assert response.json()["success"] == True
            print("Upload PASSED")

        # Test compare
        print("Testing POST /api/compare...")
        response = requests.post(f"{BASE_URL}/compare", json={"candidateId": "test_candidate"})
        response.raise_for_status()
        task_id = response.json()["task_id"]
        print(f"Compare task started with ID: {task_id}")

        # Poll for status
        print("Polling GET /api/status...")
        for _ in range(10):
            time.sleep(2)
            response = requests.get(f"{BASE_URL}/status/{task_id}")
            response.raise_for_status()
            status = response.json()["status"]
            print(f"Task status: {status}")
            if status == "completed":
                print("Compare task COMPLETED")
                print(response.json()["result"])
                break
            elif status == "failed":
                print("Compare task FAILED")
                print(response.json()["result"])
                break
        else:
            print("Polling timed out.")

    except Exception as e:
        print(f"Upload and compare test FAILED: {e}")
    finally:
        # Clean up dummy files
        if os.path.exists("test_docs.zip"):
            os.remove("test_docs.zip")
        if os.path.exists("test_docs"):
            shutil.rmtree("test_docs")


def test_candidates():
    print("\nTesting candidate endpoints...")
    try:
        # Test get all candidates
        print("Testing GET /api/candidates...")
        response = requests.get(f"{BASE_URL}/candidates")
        response.raise_for_status()
        print("Get all candidates PASSED")

        # Test get single candidate (assuming test_candidate exists)
        print("Testing GET /api/candidates/test_candidate...")
        response = requests.get(f"{BASE_URL}/candidates/test_candidate")
        # This might be 404 if the comparison failed, so we don't assert status
        print(f"Get single candidate response: {response.status_code}")

    except Exception as e:
        print(f"Candidate endpoints test FAILED: {e}")


if __name__ == "__main__":
    import shutil
    import zipfile
    
    test_health()
    test_login()
    test_upload_and_compare()
    test_candidates()
