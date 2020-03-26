# from sqlalchemy import Column, Integer, String, REAL
# from database.base import Base, Session

from database.db import *
from database.models.user import UserModel

class UserRegistrationRequestModel(db.Model):
    __tablename__ = 'otr_user_registrations_requests'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128))
    password = db.Column(db.String(128))
    email = db.Column(db.String(128))
    phone = db.Column(db.String(20))
    companyName = db.Column(db.String(128))
    status = db.Column(db.String(128))

    def __init__(self, username, password, email, phone, companyName):
        hashedPassword = UserModel.generate_hash(password)
        self.username = username
        self.password = hashedPassword
        self.email = email
        self.phone = phone
        self.companyName = companyName
        self.status = 'pending'

    def json(self):
        return {
            'id': self.id, 
            'username': self.username, 
            'email': self.email, 
            'companyName': self.companyName, 
            'status': self.status
        }

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, urr_username):
        return cls.query.filter_by(username=urr_username).first()

    @classmethod
    def find_by_id(cls, urr_id):
        return cls.query.filter_by(id=urr_id).first()

    @classmethod
    def find_by_email(cls, urr_email):
        return cls.query.filter_by(email=urr_email).first()

    @classmethod
    def get_list(cls):
        session = Session()
        return session.query(UserRegistrationRequestModel).all()

