from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Optional: Add CORS middleware for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Internal API Key Security Scheme
api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != settings.SECRET_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal API key")
    return api_key

# Health check route (unprotected)
@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME
    }

# Register API endpoints (protected by internal API Key)
app.include_router(
    api_router,
    prefix=settings.API_V1_STR,
    dependencies=[Depends(verify_api_key)]
)