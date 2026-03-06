from fastapi import FastAPI
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

app = FastAPI(title="Portfolio Manager API")

DATABASE_URL = os.getenv("DATABASE_URL")

@app.get("/health")
def health_check():
    return {"status": "online", "database": "connected" if DATABASE_URL else "config_missing"}

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Portfolio Manager!"}