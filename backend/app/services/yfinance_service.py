import yfinance as yf
from typing import Dict, List

def get_current_prices_batch(tickers: List[str]) -> Dict[str, float]:
    """
    Busca os preços atuais de uma lista de tickers de uma só vez.
    Retorna um dicionário: {"PETR4": 35.50, "VALE3": 62.10}
    """
    if not tickers:
        return {}

    # Formata para o Yahoo Finance (ex: PETR4 -> PETR4.SA)
    formatted_map = {
        (f"{t}.SA" if not t.endswith((".SA", ".US")) else t): t 
        for t in tickers
    }
    
    try:
        # Baixa os dados de todos os tickers formatados
        data = yf.download(list(formatted_map.keys()), period="1d", interval="1m", progress=False)
        
        prices = {}
        for formatted_ticker, original_ticker in formatted_map.items():
            try:
                # Tenta pegar o último preço de fechamento (Close)
                # O yfinance retorna um DataFrame; se for apenas um ticker, a estrutura muda levemente
                if len(formatted_map) > 1:
                    price = data['Close'][formatted_ticker].iloc[-1]
                else:
                    price = data['Close'].iloc[-1]
                
                prices[original_ticker] = round(float(price), 2)
            except Exception:
                prices[original_ticker] = 0.0
                
        return prices
    except Exception as e:
        print(f"Erro ao buscar lote de cotacoes: {e}")
        return {t: 0.0 for t in tickers}

# Mantemos a versão individual para compatibilidade, se necessário
def get_current_price(ticker: str) -> float:
    result = get_current_prices_batch([ticker])
    return result.get(ticker, 0.0)