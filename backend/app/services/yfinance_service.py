import yfinance as yf

def get_current_price(ticker: str) -> float:
    try:
        # No Yahoo Finance, ações brasileiras precisam do sufixo ".SA" (ex: PETR4.SA)
        # Se o usuário não mandou com .SA, a gente adiciona automaticamente
        ticker_formatted = f"{ticker}.SA" if not ticker.endswith((".SA", ".US")) else ticker
        
        # Busca os dados do ativo
        stock = yf.Ticker(ticker_formatted)
        
        # fast_info é o jeito mais rápido de pegar o preço atual sem baixar o histórico todo
        current_price = stock.fast_info.last_price
        
        return round(current_price, 2)
    except Exception as e:
        # Se der erro (ex: sem internet ou ticker inválido), retorna 0.0 para não quebrar a API
        print(f"Erro ao buscar cotacao para {ticker}: {e}")
        return 0.0