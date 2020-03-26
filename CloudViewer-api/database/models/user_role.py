from database.db import *

class UserRoleModel(db.Model):
    __tablename__ = 'otr_roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))

    def __init__(self, name):
        self.name = name

    def json(self):
        return {'id': self.id, 'name': self.name}

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_id(cls, role_id):
        return cls.query.filter_by(_id=role_id).first()
