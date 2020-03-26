from flask_restful import Resource
from flask import request
from mongodb.mongoAlarms import MongoAlarms
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class DeleteAlarm(Resource):
    @jwt_required
    def put(self):
        try:
            claims = get_jwt_claims()
            custId = claims["customerID"]

            assetId = request.json.get('assetId', None)
            deviceId = request.json.get('deviceId', None)
            pointId = request.json.get('pointId', None)
            alarmId = request.json.get('alarmId', None)

            mongo = MongoAlarms()
            mongo.delete_alarm_in_asset(custId, assetId, deviceId, pointId, alarmId)

            return {'message': 'successfully deleted the alarm'}, 200

        except Exception as ex:
            print('error in DeleteAlarm_Endpoint :' + str(ex))
