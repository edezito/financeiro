from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.core import schemas
from app.infra import models
from app.infra.database import get_db

router = APIRouter()

@router.post("/trade", response_model=schemas.AssetResponse)
def trade_asset(trade: schemas.TradeCreate, db: Session = Depends(get_db)):
    logged_in_user_id = "user_123"
    ticker_upper = trade.ticker.upper() # Padroniza para maiúsculo (ex: petr4 -> PETR4)

    # Busca se o usuário já tem essa ação na carteira
    asset = db.query(models.Asset).filter(
        models.Asset.user_id == logged_in_user_id,
        models.Asset.ticker == ticker_upper
    ).first()

    if trade.type == "compra":
        if asset:
            # Calcula o novo preço médio e soma a quantidade
            total_cost_current = asset.quantity * asset.average_price
            total_cost_new = trade.quantity * trade.price
            
            asset.quantity += trade.quantity
            asset.average_price = (total_cost_current + total_cost_new) / asset.quantity
        else:
            # Primeira compra desse ativo
            asset = models.Asset(
                user_id=logged_in_user_id, 
                ticker=ticker_upper, 
                quantity=trade.quantity, 
                average_price=trade.price
            )
            db.add(asset)

    elif trade.type == "venda":
        # CRITÉRIO DE ACEITE: Validação de quantidade
        if not asset or asset.quantity < trade.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Saldo insuficiente de {ticker_upper}. Você possui {asset.quantity if asset else 0} cotas."
            )
        
        asset.quantity -= trade.quantity
        
        # Se zerar a posição, podemos zerar o preço médio
        if asset.quantity == 0:
            asset.average_price = 0.0

    db.commit()
    db.refresh(asset)
    return asset

@router.get("/positions", response_model=List[schemas.AssetResponse])
def get_portfolio(db: Session = Depends(get_db)):
    logged_in_user_id = "user_123"
    # Retorna apenas os ativos que o usuário ainda tem saldo (> 0)
    assets = db.query(models.Asset).filter(
        models.Asset.user_id == logged_in_user_id,
        models.Asset.quantity > 0
    ).all()
    return assets