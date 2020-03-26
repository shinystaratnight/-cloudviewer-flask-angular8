# from database.db import *
#
#
# class OTRDeviceModel(db.Model):
#     __tablename__ = 'otr_status'
#
#     # Already Exist in database
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     statusID = db.Column('statusID', int)                                # from hardware table
#     shortName = db.Column('name', db.String(80))                            # from hardware table
#
#
#     # Not moving, moving
#     @classmethod
#     def get_num_from_string(cls, nameToConvert):
#         state = cls.query.filter_by(name=nameToConvert).first()
#         if state is None:
#             stateID = 0
#         else:
#             stateID = state.stateID
#         return stateID