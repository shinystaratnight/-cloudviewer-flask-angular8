# # from sqlalchemy import Column, Integer, String, REAL
# # from database.base import Base
# # Base = declarative_base()


# class OTRDeviceModel(Base):
#     __tablename__ = 'otrStatus'

#     # Already Exist in database
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     statusID = Column('statusID', int)             # from hardware table
#     shortName = Column('name', String(80))         # from hardware table
#     LongName = Column('name', String(80))

#     # Not moving, moving