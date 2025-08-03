import os
import requests
import json

def send_simple_message():
    try:
        response = requests.post(
            "https://api.mailgun.net/v3/sandboxc3602cc9f3d2424091a33e0ea3cabe27.mailgun.org/messages",
            auth=("api", os.getenv('API_KEY', 'API_KEY')),
            data={
                "from": "Mailgun Sandbox <postmaster@sandboxc3602cc9f3d2424091a33e0ea3cabe27.mailgun.org>",
                "to": "Dan Higgins <danhiggins@higginscompany.com>",
                "subject": "Hello Dan Higgins",
                "text": "Congratulations Dan Higgins, you just sent an email with Mailgun! You are truly awesome!"
            },
            timeout=30  # Add timeout to prevent hanging
        )
        
        # Print detailed response information
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        # Check if request was successful
        if response.status_code == 200:
            try:
                response_data = response.json()
                print(f"✅ Email sent successfully!")
                print(f"Message ID: {response_data.get('id', 'No ID returned')}")
                print(f"Message: {response_data.get('message', 'No message returned')}")
                return True, response_data
            except json.JSONDecodeError:
                print("✅ Email sent successfully (non-JSON response)")
                return True, response.text
        else:
            print(f"❌ Failed to send email")
            print(f"Error: {response.text}")
            return False, response.text
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed with exception: {e}")
        return False, str(e)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False, str(e)

def check_api_key():
    """Helper function to verify API key is set"""
    api_key = os.getenv('API_KEY', 'API_KEY')
    if api_key == 'API_KEY':
        print("⚠️  WARNING: API_KEY environment variable not set or using default value")
        print("   Make sure to set your actual Mailgun API key")
        return False
    else:
        print(f"✅ API Key found: {api_key[:10]}...")
        return True

# Main execution
if __name__ == "__main__":
    print("🚀 Starting Mailgun email test...")
    
    # Check API key first
    if not check_api_key():
        print("\n❌ Please set your API_KEY environment variable and try again")
        exit(1)
    
    # Send the email
    success, result = send_simple_message()
    
    if success:
        print(f"\n🎉 Email operation completed successfully!")
    else:
        print(f"\n💥 Email operation failed!")
        
    print(f"\nResult: {result}")