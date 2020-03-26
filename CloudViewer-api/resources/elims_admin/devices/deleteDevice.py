from flask_restful import Resource
from flask import request, jsonify
from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required, get_jwt_claims)


class DeleteDevice(Resource):

    @jwt_required
    def post(self):
        claims = get_jwt_claims()
        accessLevel = claims['accessLevel']
        if accessLevel is None:
            return jsonify({'Message': 'Access level must be provided in jwt', 'success': 0})
        elif accessLevel < 4:
            return jsonify({'Message': 'Permission denied for this operation', 'success': 0})
        else:
            assetId = request.json.get('assetId')
            deviceId = request.json.get('deviceId')

            if not request.is_json:
                return {"message": "Missing JSON in request"}, 400

            if assetId is None:
                return jsonify({'Message': 'Cannot delete because assetId not provided', 'success': 0})

            if deviceId is None:
                return jsonify({'Message': 'Cannot delete because deviceId not provided', 'success': 0})

            mongo = MongoHistorian()
            mongo.deleteDevice(assetId, deviceId)

            return jsonify({'Message': 'Sucessfully deleted device', 'success': 1})