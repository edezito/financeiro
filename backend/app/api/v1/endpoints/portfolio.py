from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.core import schemas
from app.infra import models
from app.infra.database import get_db

from app.services import yfinance_service

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

@router.get("/performance", response_model=List[schemas.PortfolioPerformanceResponse])
def get_portfolio_performance(db: Session = Depends(get_db)):
    logged_in_user_id = "user_123"
    
    # 1. Pega todas as posições do usuário no banco
    assets = db.query(models.Asset).filter(
        models.Asset.user_id == logged_in_user_id,
        models.Asset.quantity > 0
    ).all()

    performance_list = []
    
    # 2. Para cada ativo, busca o preço e calcula o lucro
    for asset in assets:
        current_price = yfinance_service.get_current_price(asset.ticker)
        
        # Matemática Financeira 101
        total_invested = asset.quantity * asset.average_price
        current_total_value = asset.quantity * current_price
        
        pl_value = current_total_value - total_invested
        
        pl_percentage = 0.0
        if total_invested > 0:
            pl_percentage = (pl_value / total_invested) * 100

        # Adiciona na lista de resposta
        performance_list.append({
            "ticker": asset.ticker,
            "quantity": asset.quantity,
            "average_price": round(asset.average_price, 2),
            "current_price": current_price,
            "profit_loss_value": round(pl_value, 2),
            "profit_loss_percentage": round(pl_percentage, 2)
        })
        
    return performance_list