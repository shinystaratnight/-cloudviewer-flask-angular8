from database import db
from flask import logging

class AccessLevels(db.Model):
    __tablename__ = 'otr_accessLevels'

    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    name = db.Column('name', db.String(80))
    level = db.Column('level', db.String(80))

    log = logging.getLogger(__name__)

    def __init__(self, name, level):
        self.name = name
        self.level = level

    @classmethod
    def get_name_by_level(cls, level):

        return cls.query.filter_by(level=level).first()
