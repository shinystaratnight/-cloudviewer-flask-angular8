from database.db import *
from database.models.well_site_detail import WellSiteDetailModel


class WellSiteModel(db.Model):
    __tablename__ = 'JOBS'

    jobID = db.Column(db.Integer, primary_key=True)
    customerID = db.Column(db.ForeignKey('CUSTOMERS.customerID'))
    districtID = db.Column(db.Integer) #no FK?
    orderNumber = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    wellName = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    jobLocation = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    fracCrew = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    fieldTech = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    tankCount = db.Column(db.Integer)
    jobStatus = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    memo = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    postedToJob = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    requestedBy = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    createdBy = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    scheduledStartDate = db.Column(db.DateTime)
    scheduledEndDate = db.Column(db.DateTime)
    tankDeliveryDate = db.Column(db.DateTime)
    dateCreated = db.Column(db.DateTime)
    custRecDelivery = db.Column(db.Boolean)
    latitude = db.Column(db.REAL)
    longitude = db.Column(db.REAL)

    def __init__(self, customerID, districtID, orderNumber, wellName, jobLocation, fracCrew, 
    fieldTech, tankCount, jobStatus, memo, postedToJob, requestedBy, createdBy, scheduledStartDate, 
    scheduledEndDate, tankDeliveryDate, dateCreated, custRecDelivery, latitude, longitude):
        self.customerID = customerID
        self.districtID = districtID
        self.orderNumber = orderNumber
        self.wellName = wellName
        self.jobLocation = jobLocation
        self.fracCrew = fracCrew
        self.fieldTech = fieldTech
        self.tankCount = tankCount
        self.jobStatus = jobStatus
        self.memo = memo
        self.postedToJob = postedToJob
        self.requestedBy = requestedBy
        self.createdBy = createdBy
        self.scheduledStartDate = scheduledStartDate
        self.scheduledEndDate = scheduledEndDate
        self.tankDeliveryDate = tankDeliveryDate
        self.dateCreated = dateCreated #is this automatic when created?
        self.custRecDelivery = custRecDelivery
        self.latitude = latitude
        self.longitude = longitude


    def json(self): 
        ws_detail = WellSiteDetailModel.find_by_jobID(self.jobID)
        # print(ws_detail.primaryTechID)
        if not ws_detail:
            return {'message': 'well site details not found'}

        return {
            "jobID": self.jobID, 
            "customerID": self.customerID, 
            "districtID": self.districtID, 
            "orderNumber": self.orderNumber, 
            "wellName": self.wellName, 
            "jobLocation": self.jobLocation, 
            "fracCrew": self.fracCrew, 
            "fieldTech": self.fieldTech, 
            "tankCount": self.tankCount, 
            "jobStatus": self.jobStatus, 
            "memo": self.memo, 
            "postedToJob": self.postedToJob, 
            "requestedBy": self.requestedBy, 
            "createdBy": self.createdBy, 
            "scheduledStartDate": self.checkDate(self.scheduledStartDate), 
            "scheduledEndDate": self.checkDate(self.scheduledEndDate), 
            "tankDeliveryDate": self.checkDate(self.tankDeliveryDate), 
            "dateCreated": self.checkDate(self.dateCreated), 
            "custRecDelivery": self.custRecDelivery, 
            "termID": ws_detail.termID, 
            "stage": ws_detail.stage, 
            "tankEnable": ws_detail.tankEnable, 
            "gpsLat": ws_detail.gpsLat, 
            "gpsLong": ws_detail.gpsLong, 
            "jobStart": self.checkDate(ws_detail.jobStart), 
            "jobEnd": self.checkDate(ws_detail.jobEnd), 
            "lastUpdate": self.checkDate(ws_detail.lastUpdate),
            "latitude": self.latitude,
            "longitude": self.longitude

            # "primaryTechID": self.checkID(ws_detail.primaryTechID), fix this later 
            # "backupTech1ID": self.checkID(ws_detail.backupTech1ID), 
            # "backupTech2ID": self.checkID(ws_detail.backupTech2ID), 
            # "backupTech3ID": self.checkID(ws_detail.backupTech3ID)
        }

    def checkDate(self, date): 
        if(date):
            return date.isoformat()
        else:
            return ''

    def checkID(self, p_id):
        print("check ID method: {}".format(p_id))
        if p_id is None:
            return 'none'
        else:
            return p_id

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_by_custId(cls, custId):
        return cls.query.filter_by(customerID=custId).all()

    @classmethod
    def find_by_id(cls, j_id):
        return cls.query.filter_by(jobID=j_id).first()





