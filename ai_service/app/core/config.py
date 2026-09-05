from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Microservice Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_API_KEY: str = "your-internal-secret-key"  # لحماية الطلبات القادمة من Express فقط

    class Config:
        env_file = ".env"

settings = Settings()