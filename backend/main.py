from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# No Render, as variáveis de ambiente são injetadas direto no sistema,
# mas mantemos o load_dotenv para o seu desenvolvimento local.
load_dotenv()

app = FastAPI(title="Portfolio Manager API")

# Configuração do CORS - Libera o seu Frontend na Vercel
origins = [
    "https://financeiro-git-main-edezitos-projects.vercel.app",  # Seu site oficial
    "http://localhost:3000",               # Para testes locais
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")

@app.get("/health")
def health_check():
    return {
        "status": "online", 
        "database": "connected" if DATABASE_URL else "config_missing"
    }

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Portfolio Manager!"}