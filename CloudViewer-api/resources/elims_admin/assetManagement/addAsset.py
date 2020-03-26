from flask_restful import Resource
from flask import jsonify, request
from database.models.asset import AssetModel
from mongodb.mongoSQLAssets import MongoSQLAssets
from flask_jwt_extended import (jwt_required)
from database.models.otrState import OTRState

class AddAsset(Resource):
    @jwt_required
    def post(self):

        assetType = request.json.get('assetType', None)
        newCustId = request.json.get('leasedCustID', None)
        terminalSN = request.json.get('terminalSN', None)
        satSN = request.json.get('satSN', None)
        name = request.json.get('name', None)
        status = request.json.get('status', None)
        state = request.json.get('state', None)
        ip = request.json.get('ip', None)
        chemical = request.json.get('chemical', None)

        if assetType is None:
            return jsonify('asset type must be provided')

        if newCustId is None:
            return jsonify('new leased customer id must be provided')

        if terminalSN is None:
            return jsonify('terminalSN must be provided')

        if satSN is None:
            return jsonify('satSN must be provided')

        if name is None:
            return jsonify('name must be provided')

        if status is None:
            return jsonify('status must be provided')

        if state is None:
            return jsonify('state must be provided')

        if ip is None:
            return jsonify('IP address must be provided')

        if chemical is None:
            return jsonify('Chemical must be provided')

        # SQL Insert
        try:
            new_req = AssetModel(terminalSN, satSN, 0, name, newCustId, status,
                                 OTRState.get_string_from_num(state), "", 0, 0, assetType, ip, chemical)
            new_req.save_to_db()

            # update Mongo
            mongo = MongoSQLAssets()
            mongo.updateLeasedCust(new_req.id, newCustId)

        except Exception as error:
            return {'message': 'error adding asset: {}'.format(error)}, 500

        # Get asset info
        # asset = AssetModel.find_by_id_and_type(id, assetType)
        # asset.message = 'Good Edit'
        # return asset, 200
        return {'message': 'Good Add'}, 200
