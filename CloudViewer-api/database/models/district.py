from database.db import *

class DistrictModel(db.Model):
    __tablename__ = 'DISTRICTS'

    districtID = db.Column(db.Integer, primary_key=True)
    customerID = db.Column(db.Integer, nullable=False)
    districtName = db.Column(db.String(50, 'SQL_Latin1_General_CP1_CI_AS'), nullable=False)
    comment = db.Column(db.String(200, 'SQL_Latin1_General_CP1_CI_AS'))

    def __init__(self, customerID, districtName, comment):
        self.customerID = customerID
        self.districtName = districtName
        self.comment = comment

    def json(self):
        return {
            'id': self.districtID, 
            'customerID': self.customerID, #select customer name where id = customerID
            'district': self.districtName,
            'comment': self.comment
        }
    
    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(districtName=name).first()

    @classmethod
    def find_by_id(cls, d_id):
        return cls.query.filter_by(districtID=d_id).first()

    @classmethod
    def find_by_customer_id(cls, c_id):
        return cls.query.filter_by(customerID=c_id).all()