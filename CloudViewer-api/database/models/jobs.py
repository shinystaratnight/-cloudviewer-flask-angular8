from sqlalchemy import Column, Integer, String, DateTime
from database import Base
# Base = declarative_base()


class jobsModel(Base):
    __tablename__ = 'JOBS'

    # Already Exist in database
    jobID = Column( 'jobID', Integer)
    customerID = Column('customerID', int)                                # from hardware table
    DistrictID = Column('DisctrictID', String(80))                            # from hardware table
    orderNumber = Column('orderNumber')
    name = Column('wellName', String(80))
    location = Column('jobLocation', String(80))
    fracCrew = Column('fracCrew', String(80))
    fieldTech = Column('fieldTech', String(80))
    tankCount = Column('tankCount', Integer)
    status = Column('jobStatus', Integer)
    memo = Column('memo', String(300))
    postedToJob = Column('postedToJob', String(80)) # Do not use
    requestedBy = Column('requestedBy', String(80))
    createdBy = Column('createdBy', String(80))
    scheduledStartDate = Column('scheduledStartDate', DateTime)
    scheduledEndDate = Column('scheduledEndDate', DateTime)
    tankDeliveryDate = Column('tankDeliveryDate', DateTime)
    dateCreated = Column('dateCreated', DateTime)


    # @classmethod
    # def get_job_by_id(cls, jobId):
    #     return cls.query.filter_by(id=jobId).first()