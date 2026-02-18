import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SCOREPLEX_API_KEY = os.getenv("SCOREPLEX_API_KEY")
    SCOREPLEX_BASE_URL = os.getenv("SCOREPLEX_BASE_URL", "https://api.scoreplex.io/api/v1")
    
    # Batch/concurrency: max rows processed at once (lower = more reliable data, like Flask)
    BATCH_SIZE = int(os.getenv("BATCH_SIZE", "30"))

    # Polling settings (Scoreplex often needs 1–3 min per task for email/phone/data_leak)
    MAX_POLL_ATTEMPTS = int(os.getenv("MAX_POLL_ATTEMPTS", "60"))  # 60 x 2s = 2 min max per row
    POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "2"))  # Check every 2 seconds (match Flask)
    
    # Required statuses for early exit
    REQUIRED_STATUSES = ["email_status", "phone_status", "data_leak_status"]
    COMPLETE_VALUES = ["COMPLETE", "COMPLETED", "SUCCESS"]

settings = Settings()
