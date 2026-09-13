from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Microservice Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_API_KEY: str = "your-internal-secret-key"
    GEMINI_API_KEY: str | None = None

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()