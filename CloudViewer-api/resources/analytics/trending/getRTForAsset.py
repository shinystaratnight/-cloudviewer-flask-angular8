from flask_restful import Resource
from flask import jsonify, request
from mongodb.mongoHistorian import MongoHistorian


class GetRTForAsset(Resource):

    def get(self):
        try:
            assetId = request.json.get('assetId')

            # ! DO DO, make sure the assetId belongs to this company

            if not request.is_json:
                return {"message": "Missing JSON in request"}, 400

            if assetId == "" or assetId is None:
                return "assetid, deviceId, and updated device name cannot be blank", 400

            mongo = MongoHistorian()
            retVal = mongo.getRTForAsset(assetId)

            return jsonify(retVal)


        except Exception as ex:
            print('Error in getRTForAsset')
            return None

