import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# For local development, if DB_URL is not provided, we can use a default or mock
# Using pymysql as the driver for MySQL
# Using SQLite for local development ease, can be overridden by env var
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crm_hcp.db")

# For SQLite, we need to add connect_args
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
