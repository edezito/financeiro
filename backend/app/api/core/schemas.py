from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: Literal["receita", "despesa"]
    
class TransactionResponse(TransactionCreate):
    id: int
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class BalanceResponse(BaseModel):
    user_id: str
    total_receitas: float
    total_despesas: float
    saldo_atual: float