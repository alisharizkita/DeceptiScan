from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.dto.base_response import HealthCheckModel
from app.dto import HealthCheckResponseModel, DbTestResponseModel
from app.routes import auth_router, admin_router, predict_router, feedback_router, article_router
from dotenv import load_dotenv
from app.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy import text
import os

load_dotenv(".env.development")

app = FastAPI()

#cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_credentials=True,
    allow_headers=['*']
)

@app.get("/health", response_model=HealthCheckResponseModel, tags=['HealthCheck'])
def health_check() -> HealthCheckResponseModel:
    res = HealthCheckResponseModel(
        code=status.HTTP_200_OK,
        data=HealthCheckModel(
            status="up and running",
        )
    )
    return res

@app.get(
    "/test-db", 
    response_model=DbTestResponseModel,
    tags=['Debug'], 
    summary="Test database connection", 
    description="Verifies connection to the database by executing a simple query"
)
async def test_db(db: Session = Depends(get_db)):
    """
    Test endpoint to verify database connectivity.
    
    Returns:
        DbTestResponseModel: A response containing success/failure message and results
    """
    try:
        # Execute a simple query
        result = db.execute(text('SELECT 1')).fetchone()
        print(f"DB test successful: {result}")
        return DbTestResponseModel(message="Database connection successful", result=result[0])
    except Exception as e:
        error_msg = f"Database connection failed: {str(e)}"
        print(f"ERROR: {error_msg}")
        import traceback
        traceback.print_exc()
        return DbTestResponseModel(message=error_msg, error=str(e))

app.include_router(auth_router, prefix="/api/auth")
app.include_router(admin_router, prefix="/api/admin")
app.include_router(predict_router, prefix="/api/predict")
app.include_router(feedback_router, prefix="/api/feedback")
app.include_router(article_router, prefix="/api")