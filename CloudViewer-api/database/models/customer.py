#from database.base import db
from database.db import *

class CustomerModel(db.Model):
    __tablename__ = 'CUSTOMERS'

    customerID = db.Column(db.Integer, primary_key=True)
    customerName = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'), nullable=False)
    epCustomerID = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    custRecDelivery = db.Column(db.Integer)
    cAWSKey = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'))
    cAWSSecret= db.Column(db.String(100, 'SQL_Latin1_General_CP1_CI_AS'))
	

    def __init__(self, customerName, epCustomerID, custRecDelivery, cAWSKey, cAWSSecret):
        self.customerName = customerName
        self.epCustomerID = epCustomerID
        self.custRecDelivery = custRecDelivery
        self.cAWSKey = cAWSKey
        self.cAWSSecret = cAWSSecret

    def json(self):
        return {
            'id': self.customerID, 
            'name': self.customerName, 
            'epCustomerID': self.epCustomerID,
            'custRecDelivery': self.custRecDelivery,
			'cAWSKey': self.cAWSKey,
			'cAWSSecret': self.cAWSSecret
        }

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(customerName=name).first()

    @classmethod
    def find_by_id(cls, c_id):
        return cls.query.filter_by(customerID=c_id).first()
