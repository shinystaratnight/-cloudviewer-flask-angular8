from flask_restful import Resource
from flask import jsonify
from database.models.asset import AssetModel
from mongodb.mongoAlarms import MongoAlarms
from flask_jwt_extended import (jwt_required, get_jwt_claims)
import logging

class GetActiveAlarmsForCust(Resource):
    logger = logging.getLogger(__name__)

    @jwt_required
    def put(self):
        self.logger.info('GetActiveAlarmsForCust called')
        try:
            claims = get_jwt_claims()
            custId = claims["customerID"]

            # Get the asset Info
            assets = AssetModel.get_assets_by_custId(custId)

            mongo = MongoAlarms()
            results = []
            for asset in assets:
                # Get the alarms for the asset
                results = mongo.getActiveAlarmsForCust(results, custId, asset.id, asset.assetType, asset.name)

            return jsonify(results)

            return {"message:", "asset cannot be found"}, 200

        except Exception as ex:
            self.logger.error('error in GetActiveAlarmsForCust: ' + str(ex))
