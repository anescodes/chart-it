from fastapi import APIRouter

from app.api.v1.endpoints.csv_analysis import router as csv_analysis_router

router = APIRouter()
router.include_router(csv_analysis_router)