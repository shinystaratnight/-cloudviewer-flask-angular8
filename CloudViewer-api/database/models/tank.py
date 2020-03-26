from database.db import *
import datetime

class TankModel(db.Model):
    __tablename__ = 'TANKS'

    tankID = db.Column(db.Integer, primary_key=True)
    jobID = db.Column(db.Integer, nullable=False)
    tankNumber = db.Column(db.Integer, nullable=False)
    Type = db.Column(db.Integer)
    productDesc = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    tankStatus = db.Column(db.Integer, nullable=False)
    tankLevel = db.Column(db.Integer, nullable=False)
    tankPercent = db.Column(db.Integer, nullable=False)
    productAdded = db.Column(db.Integer, nullable=False)
    productUsed = db.Column(db.Integer, nullable=False)
    stageUsed = db.Column(db.Integer, nullable=False)
    notifyLevel = db.Column(db.Integer, nullable=False)
    volts = db.Column(db.Float(53), nullable=False)
    commsRate = db.Column(db.Float(53), nullable=False)
    io = db.Column(db.Integer, nullable=False)
    radioSignal = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'), nullable=False)
    lastUpdate = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    chemicalID = db.Column(db.Integer, db.ForeignKey('Inventory_CustomerProductName.Id'))
    trailerNumber = db.Column(db.Integer)

    # Inventory_CustomerProductName = db.relationship('InventoryCustomerProductName', primaryjoin='TANKS.chemicalID == InventoryCustomerProductName.Id', backref='tanks')

    def __init__(self, jobID, tankNumber, Type, productDesc, tankStatus, tankLevel, 
    tankPercent, productAdded, productUsed, stageUsed, notifyLevel, volts, commsRate, io, 
    radioSignal, chemicalID, trailerNumber):
        self.jobID = jobID
        self.tankNumber = tankNumber
        self.Type = Type
        self.productDesc = productDesc
        self.tankStatus = tankStatus
        self.tankLevel = tankLevel
        self.tankPercent = tankPercent
        self.productAdded = productAdded
        self.productUsed = productUsed
        self.stageUsed = stageUsed
        self.notifyLevel = notifyLevel
        self.volts = volts
        self.commsRate = commsRate
        self.io = io
        self.radioSignal = radioSignal
        self.lastUpdate = datetime.datetime.utcnow()
        self.chemicalID = chemicalID
        self.trailerNumber = trailerNumber


    def json(self):
        if(self.lastUpdate):
            last_update = self.lastUpdate.isoformat()
        else:
            last_update = '' 

        return {
            'tankID': self.tankID,
            'jobID': self.jobID, 
            'tankNumber': self.tankNumber, 
            'Type': self.Type,
            'tankStatus': self.tankStatus,
            'tankLevel': self.tankLevel,
            'tankPercent': self.tankPercent,
            'productAdded': self.productAdded,
            'productUsed': self.productUsed, 
            'stageUsed': self.stageUsed,
            'notifyLevel': self.notifyLevel,
            'volts': self.volts,
            'commsRate': self.commsRate,
            'io': self.io,
            'radioSignal': self.radioSignal,
            'lastUpdate': last_update,
            'chemicalID': self.chemicalID,
            'trailerNumber': self.trailerNumber,
        }

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, t_id):
        return cls.query.filter_by(tankID=t_id).first()