import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ignoramos o .env e criamos um arquivo local chamado "app.db"
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

# O SQLite precisa deste "check_same_thread" para funcionar bem com o FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()