from flask_restful import Resource
from flask import request
from database.models.asset import AssetModel
from mongodb.mongoAlarms import MongoAlarms
from flask_jwt_extended import (jwt_required, get_jwt_claims)
import logging

class AddAlarmForAsset(Resource):
    logger = logging.getLogger(__name__)

    @jwt_required
    def post(self):
        self.logger.info('AddAlarmForAsset just called')
        try:
            claims = get_jwt_claims()
            custId = claims["customerID"]

            assetId = request.json.get('assetId', None)
            deviceId = request.json.get("deviceId", None)
            pointId = request.json.get("pointId", None)
            alarmName = request.json.get('alarmName', None)
            alarmText = request.json.get('alarmText', None)
            alarmSetpoint = request.json.get('alarmSetpoint', None)
            alarmType = request.json.get('alarmType', None)
            alarmLevel = request.json.get('alarmLevel', None)

            if AssetModel.check_asset_to_cust(custId, assetId):
                # Add the alarm
                mongo = MongoAlarms()

                if alarmLevel is None:
                    alarmLevel = 3

                mongo.add_alarm_to_asset(custId, assetId, deviceId, pointId, alarmName, alarmText, alarmSetpoint,
                                         alarmType, alarmLevel)

                return {"message": "alarm added successfully"}, 200
            else:
                return {"message": "asset cannot be found."}, 200

        except Exception as ex:
            self.logger.error('error in AddAlarmForAsset' + str(ex))
