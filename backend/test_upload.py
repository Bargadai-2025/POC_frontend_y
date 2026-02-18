import requests

# Use your actual file path
file_path = r"C:\Users\divya\Downloads\Input 1301-1305.xlsx"

# Upload
with open(file_path, 'rb') as f:
    response = requests.post(
        "http://127.0.0.1:8000/api/process-excel",
        files={"file": ("input.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )

print("Status:", response.status_code)
print("Response:", response.json())

# Download result if success
if response.status_code == 200:
    job_id = response.json()['job_id']
    download_url = f"http://127.0.0.1:8000/api/download/{job_id}"
    
    result = requests.get(download_url)
    
    output_file = f"result_{job_id}.xlsx"
    with open(output_file, 'wb') as f:
        f.write(result.content)
    
    print(f"✅ Result saved: {output_file}")
