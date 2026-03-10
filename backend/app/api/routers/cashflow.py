router = APIRouter(prefix="/cashflow", tags=["Fluxo de Caixa"])

@router.post("/transaction", 
             response_model=schemas.TransactionResponse, 
             summary="Nova Transação",
             description="Registra uma entrada ou saída financeira simples.")
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    # ...
    return db_transaction

@router.get("/balance", 
            response_model=schemas.BalanceResponse, 
            summary="Obter Saldo Consolidado",
            description="Calcula o somatório de receitas e despesas para retornar o saldo líquido.")
def get_balance(db: Session = Depends(get_db)):
    # ...
    return balance