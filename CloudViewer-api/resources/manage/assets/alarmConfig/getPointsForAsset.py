from flask_restful import Resource
from flask import jsonify, request
from database.models.asset import AssetModel
from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required, get_jwt_claims)
import logging

class GetPointsForAsset(Resource):
    logger = logging.getLogger(__name__)

    @jwt_required
    def post(self):
        try:
            claims = get_jwt_claims()
            custId = claims["customerID"]

            assetId = request.json.get('assetId', None)

            # Get the asset Info
            asset = AssetModel.find_by_id(assetId)

            mongo = MongoHistorian()
            results = mongo.getPointsForAsset(custId, assetId, asset.name, asset.assetType)

            return jsonify(results)

        except Exception as ex:
            self.logger.error('error in GetPointsForAsset:' + str(ex))

