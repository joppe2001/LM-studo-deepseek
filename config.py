from dataclasses import dataclass
from typing import Optional

@dataclass
class Config:
    LM_STUDIO_API_BASE: str = "http://localhost:1234/v1"  # Default LM Studio port
    MODEL_NAME: str = "deepseek-r1-distill-qwen-1.5b@q8_0"
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7
    STREAM_CHUNK_SIZE: int = 1024
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    NGROK_AUTH_TOKEN: str = "2sH1hYUSccOJBXEwUX4ftSW6Vxf_61sHvyhChFDf7VfN9dFYA"