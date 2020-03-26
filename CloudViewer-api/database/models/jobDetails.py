from sqlalchemy import Column, Integer, String, REAL, DateTime
from database import Base
# Base = declarative_base()


class jobsDetailsModel(Base):
    __tablename__ = 'JOB_DETAIL'

    # Already Exist in database
    detailID = Column('detailID', Integer)
    jobIDID = Column('jobID', Integer)
    termID = Column('termID', Integer)                      # Not sure how to handle this one yet.
    stage = Column('stage', Integer)
    tankEnable = Column('tankEnable', Integer)              # Not sure what this is used for yet.
    gpsLat = Column('gpsLat', REAL)
    gpsLong = Column('gpsLong', REAL)
    jobStart = Column('jobStart', DateTime)
    jobEnd = Column('jobEnd', DateTime)
    lastUpdate = Column('lastUpdate', DateTime)
    primaryTechID = Column('primaryTechID', String(80))     # probably will not use for OTR
    backupTech1ID = Column('backupTech1ID', String(80))     # probably will not use for OTR
    backupTech2ID = Column('backupTech2ID', String(80))     # probably will not use for OTR
    backupTech3ID = Column('backupTech3ID', String(80))     # probably will not use for OTR
