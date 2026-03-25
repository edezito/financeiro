from sqlalchemy import Column, Integer, String, Numeric, DateTime
from datetime import datetime
from app.infra.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    # Usar Numeric(10, 2) é melhor para valores financeiros
    amount = Column(Numeric(10, 2), nullable=False)
    type = Column(String, nullable=False) # 'receita' ou 'despesa'
    created_at = Column(DateTime, default=datetime.utcnow)

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    ticker = Column(String, index=True, nullable=False) 
    quantity = Column(Integer, default=0)
    average_price = Column(Numeric(10, 2), default=0.0)