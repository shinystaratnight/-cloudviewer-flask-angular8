from flask_restful import Resource
from flask import request
from mongodb.mongoAlarms import MongoAlarms
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class EditAlarm(Resource):
    @jwt_required
    def put(self):
        claims = get_jwt_claims()
        custId = claims["customerID"]

        assetId = request.json.get('assetId', None)
        deviceId = request.json.get('deviceId', None)
        pointId = request.json.get('pointId', None)
        alarmId = request.json.get('alarmId', None)
        alarmName = request.json.get('alarmName', None)
        alarmText = request.json.get('alarmText', None)
        alarmSetpoint = request.json.get('alarmSetpoint', None)
        alarmType = request.json.get('alarmType', None)
        alarmLevel = request.json.get('alarmLevel', None)

        if alarmLevel is None:
            alarmLevel = 3

        mongo = MongoAlarms()

        status_code = mongo.update_alarm_in_asset(custId, assetId, deviceId, pointId, alarmId,alarmName, alarmText, alarmSetpoint, alarmType, alarmLevel)
        if status_code == 1:
            return {"message": "Successfully updated alarm"}
        else:
            return {"message": "Unsucessfull at updating alarm"}
