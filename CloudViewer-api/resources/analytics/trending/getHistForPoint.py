from flask_restful import Resource
from flask import jsonify, request
from mongodb.mongoHistorian import MongoHistorian
import datetime


class GetHistForPoint(Resource):

    def put(self):
        try:
            assetId = request.json.get('assetId')
            deviceId = request.json.get('deviceId')
            pointId = request.json.get('pointId')
            start = request.json.get('start')
            end = request.json.get('end')

            test = datetime.datetime.utcnow()
            test1 = str(test)

            # ! TO DO, make sure the assetId belongs to this company

            if not request.is_json:
                return {"message": "Missing JSON in request"}, 400

            if assetId == "" or assetId is None:
                return "assetid cannot be blank", 400

            if deviceId == "" or deviceId is None:
                return "deviceId cannot be blank", 400

            if pointId == "" or pointId is None:
                return "pointId cannot be blank", 400

            if start == "" or start is None:
                return "start date cannot be blank", 400

            if end == "" or end is None:
                return "end date cannot be blank", 400

            mongo = MongoHistorian()
            retVal = mongo.getHistForPoint(assetId, deviceId, pointId, start, end)

            return jsonify(retVal)


        except Exception as ex:
            print('Error in getRTForAsset')
            return None
