# # from sqlalchemy import Column, Integer, String, REAL
# # from database.base import Base
# # Base = declarative_base()


# class OTRState(Base):
#     __tablename__ = 'OTRState'

#     # Already Exist in database
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     stateID = Column('stateID', int)                                # from hardware table
#     shortName = Column('shortName', String(80))                            # from hardware table
#     longName = Column('longName', String(80))

#     # Standby, Picking up chemicals, going to wellsite, at wellsite