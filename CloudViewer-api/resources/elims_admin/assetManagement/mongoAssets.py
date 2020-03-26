from flask_restful import Resource
from flask import request

from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required)


class MongoAsset(Resource):


    @jwt_required
    def post(self):
        name = request.json.get('name', None)
        termId = request.json.get('termId', None)
        satId = request.json.get('satId', None)
        assetType = request.json.get('assetType', None)
        leasedCustId = request.json.get('custId', None)
        status = request.json.get('status', None)
        state = request.json.get('state', None)


        try:
            mongo = MongoHistorian()
            mongo.addAsset(name, termId, satId, assetType, leasedCustId, status, state, 0, 0)

        except Exception as error:
            return {"message": "An error occurred saving asset: {}".format(error)}, 500

        return {"message": "asset created"}, 200

