from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Importamos os schemas, modelos e a conexão com o banco
from app.api.core import schemas
from app.infra import models
from app.infra.database import get_db

router = APIRouter()

@router.post("/transaction", response_model=schemas.TransactionResponse)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    # Simulando usuário logado (depois virá do token JWT)
    logged_in_user_id = "user_123" 
    
    # 1. Prepara o objeto para o banco de dados
    db_transaction = models.Transaction(
        user_id=logged_in_user_id,
        description=transaction.description,
        amount=transaction.amount,
        type=transaction.type
    )
    
    # 2. Salva no banco (Supabase)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction) # Atualiza o objeto com o ID gerado pelo banco
    
    return db_transaction

@router.get("/balance", response_model=schemas.BalanceResponse)
def get_balance(db: Session = Depends(get_db)):
    logged_in_user_id = "user_123"
    
    # Busca todas as transações deste usuário no banco
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == logged_in_user_id).all()
    
    # Calcula os totais
    receitas = sum(t.amount for t in transactions if t.type == "receita")
    despesas = sum(t.amount for t in transactions if t.type == "despesa")
    
    return {
        "user_id": logged_in_user_id,
        "total_receitas": receitas,
        "total_despesas": despesas,
        "saldo_atual": receitas - despesas
    }