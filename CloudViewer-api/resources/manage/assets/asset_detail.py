from flask_restful import Resource
from flask import jsonify, request
from database.models.asset import AssetModel
from database.models.well_site import WellSiteModel
from database.models.otrState import OTRState
from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required)

class AssetDetail(Resource):

    @jwt_required
    def get(self, id):
        # TODO: Check customerId to make sure user has access to this device. Add custId to query function

        # Get asset info
        assetType = 'otr'
        asset = AssetModel.find_by_id_and_type(id, assetType)

        # Get Active Wellsite name
        wellsiteName = ''
        if asset.activeWellsite is not None:
            if asset.activeWellsite > 0:
                wellsite = WellSiteModel.find_by_id(asset.activeWellsite)
                if wellsite is not None:
                    wellsiteName = wellsite.wellName

        if wellsiteName is '':
            wellsiteName = 'Not allocated to wellsite'

        if asset is None:
            return {'message': 'asset not found'}, 205

        # Get realtime info
        mongo = MongoHistorian()
        assetRT = mongo.getRTForAsset(int(id))
        state = OTRState.get_num_from_string(asset.state)
        results = {"id": asset.id,
                   "termId": asset.terminalSN,
                   "satId": asset.satSN,
                   "name": asset.name,
                   "status": asset.status,
                   "state": state,
                   "assetType": asset.assetType,
                   "activeWellsite": asset.activeWellsite,
                   "activeWellsiteName": wellsiteName,
                   "latitude": asset.latitude,
                   "longitude": asset.longitude,
                   'chemical': asset.chemical,
                   "points": assetRT}

        return jsonify(results)

        return {'message': 'asset not found'}, 200


    @jwt_required
    def put(self, id):
        assetType = 'otr'
        asset = AssetModel.find_by_id_and_type(id, assetType)
        if asset is None:
            return {'message': 'asset not found'}, 200
        else:
            # asset.terminalSN = request.json.get('terminalSN', None)
            # asset.satSN = request.json.get('satSN', None)
            # asset.tankID = request.json.get('tankID', None)
            # asset.name = request.json.get('name', None)
            # asset.leasedCustID = request.json.get('leasedCustID', None)
            asset.status = request.json.get('status', None)
            asset.state = request.json.get('state', None)
            asset.activeWellsite = request.json.get('activeWellsiteID', None)
            asset.chemical = request.json.get('chemical', None)
            # asset.latitude = request.json.get('latitude', None)
            # asset.longitude = request.json.get('longitude', None)
            # asset.assetType = request.json.get('assetType', None)

            try:
                asset.save_to_db()
            except Exception as error:
                return {'message': 'error updating asset: {}'.format(error)}, 500

        return asset.json()