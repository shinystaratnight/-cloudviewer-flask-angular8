from database.db import *

class AlarmTypesModel(db.Model):
    __tablename__ = 'otr_alarmTypes'

    id = db.Column(db.Integer, primary_key=True)
    alarmTypeId = db.Column(db.Integer)
    name = db.Column(db.String(20))

    @classmethod
    def get_alarm_types(cls):
        return cls.query.all()
