from flask_restful import Resource
from flask import jsonify, request
from database.models.asset import AssetModel
# from database.models.well_site import WellSiteModel
from database.models.otrState import OTRState
# from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required)

class GetAllAssets(Resource):

    @jwt_required
    def get(self):
        # TODO: Check customerId to make sure user has access to this device. Add custId to query function

        # Get asset info
        results = []
        allAssets = AssetModel.getAllAssetInfo()
        for asset in allAssets:

            state = OTRState.get_num_from_string(asset.state)
            assetResult = {"id": asset.id,
                           "name": asset.name,
                           "status": asset.status,
                           "state": state,
                           "latitude": asset.latitude,
                           "longitude": asset.longitude,
                           "assetType": asset.assetType,
                           "satSN": asset.satSN,
                           "terminalSN": asset.terminalSN,
                           "ip": asset.ip,
                           "leasedCustID": asset.leasedCustID,
                           "chemical": asset.chemical
                           }

            results.append(assetResult)

        return jsonify(results)
