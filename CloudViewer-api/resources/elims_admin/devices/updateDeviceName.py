from flask_restful import Resource
from flask import request, jsonify
from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required, get_jwt_claims)


class UpdateDeviceName(Resource):

    @jwt_required
    def post(self):
        claims = get_jwt_claims()
        accessLevel = claims['accessLevel']

        if accessLevel is None:
            return jsonify({'Message': 'Access level must be provided in jwt', 'success': 0})
        elif accessLevel < 3:
            return jsonify({'Message': 'Permission denied for this operation', 'success': 0})
        else:
            assetId = request.json.get('assetId')
            deviceId = request.json.get('deviceId')
            updatedDeviceName = request.json.get('updatedName')

            if not request.is_json:
                return {"message": "Missing JSON in request"}, 400

            if assetId == "" or deviceId == "" or updatedDeviceName == "":
                return jsonify({'Message': 'assetId, deviceId, and updated device name cannot be blank', 'success': 0})

            mongo = MongoHistorian()
            mongo.updateDeviceName(assetId, deviceId, updatedDeviceName)

            return jsonify({'Message': 'Asset name successfully updated', 'success': 1})
