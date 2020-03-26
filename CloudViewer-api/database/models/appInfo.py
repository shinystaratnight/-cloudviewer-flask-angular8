from sqlalchemy import Column, Integer, String
from database import Base


class AppInfoModel(Base):
    __tablename__ = 'otr_appInfo'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    appName = Column('appName', String(80))
    appVersion = Column('appVersion', String(80))

