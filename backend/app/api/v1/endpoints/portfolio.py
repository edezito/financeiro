from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.core import schemas
from app.infra import models
from app.infra.database import get_db
from app.services import yfinance_service

router = APIRouter(prefix="/portfolio", tags=["Portfólio de Ativos"])

@router.post("/trade", 
             response_model=schemas.AssetResponse, 
             summary="Registrar Compra/Venda",
             description="Executa uma ordem de trade. Atualiza preço médio em compras e valida saldo em vendas.")
def trade_asset(trade: schemas.TradeCreate, db: Session = Depends(get_db)):
    logged_in_user_id = "user_123"
    ticker_upper = trade.ticker.upper()

    asset = db.query(models.Asset).filter(
        models.Asset.user_id == logged_in_user_id,
        models.Asset.ticker == ticker_upper
    ).first()

    if trade.type == "compra":
        if asset:
            total_cost_current = asset.quantity * asset.average_price
            total_cost_new = trade.quantity * trade.price
            asset.quantity += trade.quantity
            asset.average_price = (total_cost_current + total_cost_new) / asset.quantity
        else:
            asset = models.Asset(
                user_id=logged_in_user_id, 
                ticker=ticker_upper, 
                quantity=trade.quantity, 
                average_price=trade.price
            )
            db.add(asset)

    elif trade.type == "venda":
        if not asset or asset.quantity < trade.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Saldo insuficiente de {ticker_upper}. Você possui {asset.quantity if asset else 0} cotas."
            )
        asset.quantity -= trade.quantity
        if asset.quantity == 0:
            asset.average_price = 0.0

    db.commit()
    db.refresh(asset)
    return asset

@router.get("/positions", 
            response_model=List[schemas.AssetResponse], 
            summary="Listar Posições Atuais",
            description="Retorna todos os ativos com saldo positivo na carteira.")
def get_portfolio(db: Session = Depends(get_db)):
    logged_in_user_id = "user_123"
    return db.query(models.Asset).filter(
        models.Asset.user_id == logged_in_user_id,
        models.Asset.quantity > 0
    ).all()

@router.get("/performance", 
            response_model=List[schemas.PortfolioPerformanceResponse], 
            summary="Calcular Performance (PL)",
            description="Cruza os dados do banco com preços em lote via Yahoo Finance para maior rapidez.")
def get_portfolio_performance(db: Session = Depends(get_db)):
    logged_in_user_id = "user_123"
    
    assets = db.query(models.Asset).filter(
        models.Asset.user_id == logged_in_user_id,
        models.Asset.quantity > 0
    ).all()

    if not assets:
        return []

    # Otimização: Busca todos os preços de uma vez
    tickers = [a.ticker for a in assets]
    current_prices = yfinance_service.get_current_prices_batch(tickers)

    performance_list = []
    for asset in assets:
        price = current_prices.get(asset.ticker, 0.0)
        total_invested = asset.quantity * asset.average_price
        current_total_value = asset.quantity * price
        pl_value = current_total_value - total_invested
        pl_percentage = (pl_value / total_invested * 100) if total_invested > 0 else 0.0

        performance_list.append({
            "ticker": asset.ticker,
            "quantity": asset.quantity,
            "average_price": round(asset.average_price, 2),
            "current_price": price,
            "profit_loss_value": round(pl_value, 2),
            "profit_loss_percentage": round(pl_percentage, 2)
        })
        
    return performance_list