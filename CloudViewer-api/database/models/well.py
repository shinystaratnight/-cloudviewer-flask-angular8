from database.db import *


class WellModel(db.Model):
    __tablename__ = 'otr_wells'

    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    jobID = db.Column('jobID', db.Integer)
    wellName = db.Column('wellName', db.String(80))
    currentStage = db.Column('currentStage', db.Integer)
    status = db.Column('status', db.String(80))
    api = db.Column('api', db.String(80))
    customerID = db.Column('customerID', db.Integer)

    def __init__(self, jobID, wellName, currentStage, status, api, customerID): 
        self.jobID = jobID
        self.wellName = wellName
        self.currentStage = currentStage
        self.status = status
        self.api = api
        self.customerID = customerID
    
    def json(self): 
        return {
            "id": self.id, 
            "jobID": self.jobID, 
            "wellName": self.wellName, 
            "currentStage": self.currentStage, 
            "status": self.status, 
            "api": self.api, 
            "customerID": self.customerID
        }
    
    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_jobID(cls, j_id):
        return cls.query.filter_by(jobID = j_id).all()

    @classmethod
    def find_by_custID(cls, c_id):
        return cls.query.filter_by(customerID = c_id).all()

    @classmethod
    def find_by_id(cls, w_id):
        return cls.query.filter_by(id=w_id).first()
