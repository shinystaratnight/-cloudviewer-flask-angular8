from database.db import *
from passlib.hash import pbkdf2_sha256 as sha256
# from database.models.user_role import UserRoleModel
from database.models.customer import CustomerModel


class UserModel(db.Model):
    __tablename__ = 'otr_users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128))
    accessLevel = db.Column(db.Integer)
    companyID = db.Column(db.Integer)
    districtID = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    accountResetKey = db.Column(db.String(50))

    def __init__(self, username, password, email, accessLevel, companyID, districtID, phone):
        self.username = username
        self.password = password
        self.email = email
        self.accessLevel = accessLevel
        self.companyID = companyID
        self.districtID = districtID
        self.phone = phone
    
    def json(self):
        company = CustomerModel.find_by_id(self.companyID)
        return {
            'id': self.id, 
            'name': self.username,
            'email': self.email, 
            'accessLevel': self.accessLevel, 
            'companyID': self.companyID, 
            'companyName': company.customerName, 
            'districtID': self.districtID, 
            'phone': self.phone,
            'accountResetKey': self.accountResetKey
        }

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def is_admin(self, level):
        return level == 4

    @classmethod
    def update_phone(cls, phone, _id):
        userToUpdate = cls.query.filter_by(id=_id).first()
        userToUpdate.phone = phone
        db.session.commit()
        return 1

    @classmethod
    def update_resetKey(cls, ResetKey, _id):
        try:
            userToUpdate = cls.query.filter_by(id=_id).first()
            userToUpdate.accountResetKey = ResetKey
            db.session.commit()
            return 1
        except Exception as ex:
            return 0

    @classmethod
    def update_password(cls, password, _id):
        try:
            userToUpdate = cls.query.filter_by(id=_id).first()
            userToUpdate.password = cls.generate_hash(password)
            userToUpdate.accountResetKey = None
            db.session.commit()
            return 1
        except Exception as ex:
            return 0

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_resetKey(cls, resetKey):
        return cls.query.filter_by(accountResetKey=resetKey).first()

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    
    

