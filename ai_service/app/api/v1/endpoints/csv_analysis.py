from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from app.services.ml_pipeline import process_csv_data
from app.services.llm_service import generate_financial_insights

router = APIRouter()

@router.post("/analyze-csv")
async def analyze_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # 1. Run ML Pipeline
        stats = process_csv_data(df)
        
        # 2. Get Gemini Insights based on the stats (not the whole file)
        ai_insights = generate_financial_insights(stats)
        
        return {
            "success": True,
            "data": {
                **stats,
                "ai_insights": ai_insights
            }
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error during analysis.")