from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from app.processor import BulkProcessor

app = FastAPI(title="Fraud Detection Bulk Processor")

# ✅ FIXED CORS - Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create folders
os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)

@app.get("/")
def root():
    return {"message": "Fraud Detection API - Ready"}

@app.post("/api/process-excel")
async def process_excel(file: UploadFile = File(...)):
    """
    Upload Excel → Process → Return result Excel
    
    5 input rows = 5 API calls = 5 output rows
    NO WASTE - NO LOOPS
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(400, "Only Excel files allowed (.xlsx, .xls)")
    
    # Generate unique filenames
    job_id = str(uuid.uuid4())[:8]
    input_path = f"uploads/input_{job_id}.xlsx"
    output_path = f"outputs/output_{job_id}.xlsx"
    
    try:
        # Save uploaded file
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"\n📁 File uploaded: {file.filename}")
        print(f"🆔 Job ID: {job_id}\n")
        
        # Process
        processor = BulkProcessor()  # uses BATCH_SIZE from config (default 30)
        summary = await processor.process_bulk(input_path, output_path)
        
        # Return file download link
        return {
            "job_id": job_id,
            "summary": summary,
            "download_url": f"/api/download/{job_id}"
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(500, f"Processing failed: {str(e)}")
    finally:
        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)

@app.get("/api/download/{job_id}")
def download_result(job_id: str):
    """Download processed Excel file"""
    output_path = f"outputs/output_{job_id}.xlsx"
    
    if not os.path.exists(output_path):
        raise HTTPException(404, "File not found")
    
    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=f"fraud_detection_result_{job_id}.xlsx"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
