from flask_restful import Resource
from flask import jsonify, request
from database.models.asset import AssetModel
from database.models.tank import TankModel
from database.models.customer import CustomerModel
from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class ManageFacility(Resource):
    @jwt_required
    def post(self, id):
        terminalSN = request.json.get('terminalSN', None)
        satSN = request.json.get('satSN', None)
        tankID = request.json.get('tankID', None)
        name = request.json.get('name', None)
        leasedCustID = request.json.get('leasedCustID', None)
        status = request.json.get('status', None)
        state = request.json.get('state', None)
        activeWellsite = request.json.get('activeWellsite', None)
        latitude = request.json.get('latitude', None)
        longitude = request.json.get('longitude', None)
        assetType = request.json.get('assetType', None)
        
        tank = TankModel.find_by_id(tankID)
        if tank is None:
            return {'message': 'error: tank not found'}, 200

        customer = CustomerModel.find_by_id(leasedCustID)
        if customer is None:
            return {'message': 'error: customer not found'}, 200

        new_asset = AssetModel(terminalSN, satSN, tank.tankID, name, customer.customerID, status, state, activeWellsite, latitude, longitude, assetType)

        try:
            new_asset.save_to_db()
        except Exception as error:
            return {"message": "An error occurred saving asset: {}".format(error)}, 500

        return new_asset.json (), 201

    @jwt_required
    def get(self, id):
        # Get asset info
        assetType = 'otr'
        asset = AssetModel.find_by_id_and_type(id, assetType)

        if asset is None:
            return {'message': 'asset not found'}, 205

        # Get realtime info
        mongo = MongoHistorian()
        assetRT = mongo.getRTForAsset(int(id))

        results = { "id": asset.id,
                    "termId": asset.terminalSN,
                    "satId": asset.satSN,
                    "name": asset.name,
                    "latitude": asset.latitude,
                    "longitude": asset.longitude,
                    "points": assetRT}

        return jsonify(results)


        return {'message': 'asset not found'}, 200

    @jwt_required
    def delete(self, id):
        assetType = 'facility'
        asset = AssetModel.find_by_id_and_type(id, assetType)
        if asset is None:
            return {'message':'asset not found'}, 200
        else:
            try:
                asset.delete_from_db()
            except Exception as error:
                return {'message':'error deleting asset: {}'.format(error)}, 500

        return {'message':'asset {} deleted'.format(id)}, 200

    @jwt_required
    def put(self, id):
        assetType = 'facility'
        asset = AssetModel.find_by_id_and_type(id, assetType)
        if asset is None:
            return {'message':'asset not found'}, 200
        else:
            # asset.terminalSN = request.json.get('terminalSN', None)
            # asset.satSN = request.json.get('satSN', None)
            # asset.tankID = request.json.get('tankID', None)
            # asset.name = request.json.get('name', None)
            # asset.leasedCustID = request.json.get('leasedCustID', None)
            asset.status = request.json.get('status', None)
            asset.state = request.json.get('state', None)
            asset.activeWellsite = request.json.get('activeWellsiteID', None)
            # asset.latitude = request.json.get('latitude', None)
            # asset.longitude = request.json.get('longitude', None)
            # asset.assetType = request.json.get('assetType', None)

            try:
                asset.save_to_db()
            except Exception as error:
                return {'message':'error updating asset: {}'.format(error)}, 500

        return asset.json()

class ManageFacilityList(Resource):
    @jwt_required
    def stripSpaces(x, y):
        return {y.translate({32: None}): x for y, x in y.json().items()}


    @jwt_required
    def get(self):
        claims = get_jwt_claims()

        customerId = claims['customerID']

        assetType = 'facility'

        assets = AssetModel.get_assets_by_custId_assetType(customerId, assetType)
        retVal = [{'id': asset.id,
                   'name': asset.name,
                   'termId': asset.terminalSN,
                   'latitude': asset.latitude,
                   'longitude': asset.longitude,
                   'lastUpdate': asset.lastUpdate} for asset in assets]

        # 'terminalSN': asset.terminalSN,

        return jsonify(retVal)


