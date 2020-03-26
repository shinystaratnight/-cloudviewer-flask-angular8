from flask_restful import Resource
from database.models.asset import AssetModel
from mongodb.mongoHistorian import MongoHistorian
from flask import jsonify


class getPoints(Resource):
    def get(self):
        # Need to get customerID from JWT?
        custID = 3

        # first get a list of devices from SQL database
        assets = AssetModel.get_assets_by_custId_assetType(custID)

        # Put devices into a dictionary
        assetsDict = {}
        for item in assets:
            assetsDict[item.id] = item.name

        mongo = MongoHistorian()
        devicePoints = mongo.getDevicePoints(assetsDict)

        result = []
        for device in devicePoints:
            tmpDevice = {'deviceName': device.deviceName, 'deviceId': device.deviceId}
            tmpDevice['points'] = []

            for point in device.points:
                pointItem = {'name': point.name, 'id': point.id}

                # append pointItem to tmpPoints
                tmpDevice['points'].append(pointItem)

            # Insert the tmpDevice into the result
            result.append(tmpDevice)

        data = {
            'status': 'OK',
            'devices': result
        }

        return jsonify(result)
