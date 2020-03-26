from flask_restful import Resource
from flask import jsonify, request
from database.models.asset import AssetModel
from mongodb.mongoAlarms import MongoAlarms
from flask_jwt_extended import (jwt_required, get_jwt_claims)
import logging

class GetAlarmsForAsset(Resource):
    logger = logging.getLogger(__name__)
    @jwt_required
    def put(self):
        try:
            self.logger.info('GetAlarmsForAssetJustCalled')
            claims = get_jwt_claims()
            custId = claims["customerID"]

            assetId = request.json.get('assetId', None)

            # Get the asset Info
            asset = AssetModel.find_by_id(assetId)

            if asset is None:
                return jsonify({"message": "asset cannot be found"})

            # Check to make sure that the asset belongs to the customer
            if AssetModel.check_asset_to_cust(custId, assetId):
                # Get the alarms for the asset
                mongo = MongoAlarms()
                alarms = mongo.GetAlarmsForAsset(custId, assetId, asset.assetType, asset.name)

                return jsonify(alarms)

        except Exception as ex:
            self.logger.error('error in GetAlarmsForAsset' + str(ex))


