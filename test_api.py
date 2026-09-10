"""
API Test Script
===============
Test the Pakistan Legal AI API endpoints.
"""

import requests
import json

BASE_URL = "http://localhost:5000"


def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_languages():
    """Test languages endpoint"""
    print("\n=== Testing Languages Endpoint ===")
    response = requests.get(f"{BASE_URL}/languages")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_chat_english():
    """Test chat endpoint with English query"""
    print("\n=== Testing Chat (English) ===")
    data = {
        "query": "What is the punishment for theft in Pakistan?",
        "language": "en"
    }
    response = requests.post(f"{BASE_URL}/chat", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Detected Language: {result.get('detected_language')}")
    print(f"Response: {result.get('response', 'No response')[:500]}...")
    return response.status_code == 200


def test_chat_roman_urdu():
    """Test chat endpoint with Roman Urdu query"""
    print("\n=== Testing Chat (Roman Urdu) ===")
    data = {
        "query": "Chori ki saza kya hai?",
        "language": "roman_urdu"
    }
    response = requests.post(f"{BASE_URL}/chat", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Detected Language: {result.get('detected_language')}")
    print(f"Response: {result.get('response', 'No response')[:500]}...")
    return response.status_code == 200


def test_laws_list():
    """Test laws listing endpoint"""
    print("\n=== Testing Laws List ===")
    response = requests.get(f"{BASE_URL}/laws")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Total Laws: {result.get('total_count')}")
    if result.get('laws'):
        print(f"Sample Law: {result['laws'][0]}")
    return response.status_code == 200


def test_search():
    """Test search endpoint"""
    print("\n=== Testing Search ===")
    response = requests.get(f"{BASE_URL}/search?q=divorce&limit=5")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Query: {result.get('query')}")
    print(f"Results: {result.get('total_results')}")
    return response.status_code == 200


def test_translate():
    """Test translate endpoint"""
    print("\n=== Testing Translate ===")
    data = {
        "text": "What is the punishment for theft?",
        "source": "en",
        "target": "ur"
    }
    response = requests.post(f"{BASE_URL}/translate", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Original: {result.get('original_text')}")
    print(f"Translated: {result.get('translated_text')}")
    return response.status_code == 200


def run_all_tests():
    """Run all API tests"""
    print("=" * 60)
    print("PAKISTAN LEGAL AI - API TESTS")
    print("=" * 60)
    
    tests = [
        ("Health", test_health),
        ("Languages", test_languages),
        ("Chat (English)", test_chat_english),
        ("Chat (Roman Urdu)", test_chat_roman_urdu),
        ("Laws List", test_laws_list),
        ("Search", test_search),
        ("Translate", test_translate),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"Error in {name}: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("TEST RESULTS")
    print("=" * 60)
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{name}: {status}")
    
    passed = sum(1 for _, s in results if s)
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")


if __name__ == '__main__':
    run_all_tests()
