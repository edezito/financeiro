from pydantic import BaseModel, Field
from typing import Literal, List
from datetime import datetime

# --- SCHEMAS DE FINANÇAS (CASHFLOW) ---

class TransactionCreate(BaseModel):
    description: str = Field(..., example="Salário Mensal", description="Descrição da transação")
    amount: float = Field(..., gt=0, example=5000.00, description="Valor da transação (deve ser positivo)")
    type: Literal["receita", "despesa"] = Field(..., example="receita")

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

# --- SCHEMAS DE PORTFÓLIO (INVESTIMENTOS) ---

class TradeCreate(BaseModel):
    ticker: str = Field(..., example="PETR4", description="Ticker do ativo (ex: PETR4, VALE3, AAPL)")
    quantity: int = Field(..., gt=0, example=100, description="Quantidade negociada")
    price: float = Field(..., gt=0, example=35.50, description="Preço unitário da operação")
    type: Literal["compra", "venda"] = Field(..., example="compra")

class AssetResponse(BaseModel):
    ticker: str
    quantity: int
    average_price: float

    class Config:
        from_attributes = True

class PortfolioPerformanceResponse(BaseModel):
    ticker: str
    quantity: int
    average_price: float
    current_price: float
    profit_loss_value: float = Field(..., description="Lucro ou Prejuízo nominal em R$")
    profit_loss_percentage: float = Field(..., description="Rentabilidade percentual (%)")

    class Config:
        from_attributes = True