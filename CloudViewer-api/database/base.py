# from sqlalchemy.ext.declarative import declarative_base
# Base = declarative_base()

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

# Test DB
# engine = create_engine('mssql+pymssql://elims1:Maggie123@test.cph1ok3q9izr.us-east-2.rds.amazonaws.com:1433/elims2')

# Production DB
engine = create_engine('mssql+pymssql://elims1:Maggie123@elims.cph1ok3q9izr.us-east-2.rds.amazonaws.com:1433/elims2')

Base = declarative_base()
# Base.metadata.create_all(engine, checkfirst=True)
Session = sessionmaker(bind=engine)
# print(engine.table_names())
