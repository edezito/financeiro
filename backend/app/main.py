import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.v1.endpoints import finance, portfolio
from app.infra.database import engine, Base

# Carrega as variáveis de ambiente
load_dotenv()

# Cria as tabelas se não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Portfolio Manager API",
    description="API para gestão de fluxo de caixa e performance de investimentos em tempo real.",
    version="1.0.0"
)

# CORS - Segurança para o Frontend
origins = [
    "https://financeiro-git-main-edezitos-projects.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")

# REGISTRO DE ROTAS
# Nota: O prefixo aqui deve ser apenas /api/v1. 
# O complemento (/finance ou /portfolio) já deve estar dentro de cada router.
app.include_router(finance.router, prefix="/api/v1")
app.include_router(portfolio.router, prefix="/api/v1")

@app.get("/health", tags=["Infra"])
def health_check():
    return {
        "status": "online", 
        "database": "connected" if DATABASE_URL else "config_missing"
    }

@app.get("/", tags=["Infra"])
def read_root():
    return {"message": "Bem-vindo à API do Portfolio Manager!"}