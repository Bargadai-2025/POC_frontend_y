import httpx
import asyncio

async def test_scoreplex():
    client = httpx.AsyncClient(timeout=10.0, follow_redirects=True)
    
    # Test direct API call
    api_key = ""  # Put your real key
    
    try:
        response = await client.post(
            "https://api.scoreplex.io/api/v1/search",
            params={"api_key": api_key, "report": "true"},
            json={
                "email": "test@example.com",
                "phone": "919876543210"
            }
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await client.aclose()

asyncio.run(test_scoreplex())
