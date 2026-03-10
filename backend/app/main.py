import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.v1.endpoints import finance
from app.infra.database import engine, Base
from app.infra import models

# Carrega as variáveis de ambiente (.env)
load_dotenv()

# Cria as tabelas no Supabase se elas não existirem
Base.metadata.create_all(bind=engine)

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

# Registra as rotas de finanças
app.include_router(finance.router, prefix="/api/v1/finance", tags=["Finance"])

@app.get("/health")
def health_check():
    return {
        "status": "online", 
        "database": "connected" if DATABASE_URL else "config_missing"
    }

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Portfolio Manager!"}