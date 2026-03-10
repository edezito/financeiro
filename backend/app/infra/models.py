from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
# Importamos a Base que você criou no passo anterior
from app.infra.database import Base

class Transaction(Base):
    # Nome da tabela lá no Supabase
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) # Para sabermos de quem é o dinheiro
    description = Column(String)
    amount = Column(Float)
    type = Column(String) # 'receita' ou 'despesa'
    created_at = Column(DateTime, default=datetime.utcnow)