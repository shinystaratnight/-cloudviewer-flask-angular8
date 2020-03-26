from database.db import *


class OTRState(db.Model):
    __tablename__ = 'otr_state'

    # Already Exist in database
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    stateID = db.Column('stateID', db.Integer)
    name = db.Column('name', db.String(20))
    type = db.Column('type', db.String(20))

    @classmethod
    def get_num_from_string(cls, nameToConvert):
        try:
            state = cls.query.filter_by(name=nameToConvert).first()
            if state is None:
                stateID = 0
            else:
                stateID = state.stateID
            return stateID

        except Exception as ex:
            print('Error in get_num_from_string: ' + str(ex))

    @classmethod
    def get_string_from_num(cls, numToConvert):
        try:
            state = cls.query.filter_by(stateID=numToConvert).first()
            if state is None:
                name = ''
            else:
                name = state.name
            return name

        except Exception as ex:
            print('Error in get_string_from_num: ' + str(ex))

    @classmethod
    def get_wellsite_states(cls):
        try:
            states = cls.query.filter_by(type='wellsite')
            return states
        except Exception as ex:
            print('Error in get_wellsite_states:' + str(ex))
