from database.db import *

class WellSiteDetailModel(db.Model):
    __tablename__ = 'JOB_DETAIL'

    detailID = db.Column(db.Integer, primary_key=True)
    jobID = db.Column(db.Integer, nullable=False)
    termID = db.Column(db.Integer)
    stage = db.Column(db.Integer)
    tankEnable = db.Column(db.Integer)
    gpsLat = db.Column(db.Float(53))
    gpsLong = db.Column(db.Float(53))
    jobStart = db.Column(db.DateTime)
    jobEnd = db.Column(db.DateTime)
    lastUpdate = db.Column(db.DateTime)
    primaryTechID = db.Column(db.Unicode(128))
    backupTech1ID = db.Column(db.Unicode(128))
    backupTech2ID = db.Column(db.Unicode(128))
    backupTech3ID = db.Column(db.Unicode(128))

    def __init__(self, jobID, termID, stage, tankEnable, gpsLat, gpsLong, jobStart, jobEnd, 
    lastUpdate, primaryTechID, backupTech1ID, backupTech2ID, backupTech3ID):
        self.jobID = jobID 
        self.termID = termID 
        self.stage = stage
        self.tankEnable = tankEnable
        self.gpsLat = gpsLat
        self.gpsLong = gpsLong
        self.jobStart = jobStart
        self.jobEnd = jobEnd
        self.lastUpdate = lastUpdate
        self.primaryTechID = primaryTechID
        self.backupTech1ID = backupTech1ID
        self.backupTech2ID = backupTech2ID
        self.backupTech3ID = backupTech3ID

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    def checkDate(self, date): 
        if(date):
            return date.isoformat()
        else:
            return ''

    @classmethod
    def find_by_jobID(cls, j_id):
        return cls.query.filter_by(jobID=j_id).first()
