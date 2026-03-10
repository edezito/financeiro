from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.infra.database import Base

class Transaction(Base):
    """Modelo para registro de fluxo de caixa (Receitas/Despesas)"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    description = Column(String)
    amount = Column(Float)
    type = Column(String) # 'receita' ou 'despesa'
    created_at = Column(DateTime, default=datetime.utcnow)

class Asset(Base):
    """Modelo para controle de custódia de ativos (Ações/FIIs)"""
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    ticker = Column(String, index=True) 
    quantity = Column(Integer, default=0)
    average_price = Column(Float, default=0.0)