import requests
import json

# Sample data for testing
test_data = {
    "heavyMetalConcentrations": {
        "lead": 0.00,
        "cadmium": 0.002,
        "arsenic": 0.010,
        "mercury": 0.001,
        "chromium": 0.002
    }
}

# Send POST request to the API
url = "http://localhost:3001/api/hmpi/calculate"
headers = {"Content-Type": "application/json"}
response = requests.post(url, data=json.dumps(test_data), headers=headers)

# Print the results
if response.status_code == 200:
    result = response.json()
    print("HMPI Calculation Results:")
    print(f"HPI: {result['HPI']:.2f}")
    print(f"HEI: {result['HEI']:.2f}")
    print(f"MI: {result['MI']:.2f}")
    print(f"Cd: {result['Cd']:.2f}")
    print(f"Nemerow: {result['Nemerow']:.2f}")
    print(f"Classification: {result['classification']}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
