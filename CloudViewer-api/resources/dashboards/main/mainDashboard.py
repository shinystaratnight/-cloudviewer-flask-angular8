from flask_restful import Resource
from flask import jsonify
from database.models.asset import AssetModel
from database.models.otrState import OTRState
from database.models.well_site import WellSiteModel

from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class MainDashboard(Resource):
    @jwt_required
    def get(self):
        # JWT - validate
        claims = get_jwt_claims()

        # JWT - Get CustomerID
        custId = claims["customerID"]

        # Get alarms
        mongo = MongoHistorian()
        # Get GPS data from SQL

        results = []

        # Add assets
        sqlData = AssetModel.get_assets_by_custId(custId)
        for asset in sqlData:
            state = OTRState.get_num_from_string(asset.state)

            wellSiteName = 'Not assigned'
            # Get wellsite name
            if asset.activeWellsite:
                wellsite = WellSiteModel.find_by_id(asset.activeWellsite)
                if wellsite is not None:
                    wellSiteName = wellsite.wellName

            assetResult = {"id": asset.id,
                       "name": asset.name,
                       "status": asset.status,
                       "state": state,
                       "latitude": asset.latitude,
                       "longitude": asset.longitude,
                       "assetType": asset.assetType,
                       "chemical": asset.chemical,
                       "wellSiteName": wellSiteName,
                       "points": mongo.getRTForAsset(asset.id)}

            results.append(assetResult)

        # Add Wellsites
        wellsites = WellSiteModel.get_by_custId(custId)
        for wellsite in wellsites:

            # Wellsite status enum is stored in the state model for convenience
            state = OTRState.get_num_from_string(wellsite.jobStatus)
            wellsiteResult = {"id": wellsite.jobID,
                           "name": wellsite.wellName,
                           "status": None,
                           "state": state,
                           "latitude": wellsite.latitude,
                           "longitude": wellsite.longitude,
                           "assetType": "wellsite",
                           "points": None}

            results.append(wellsiteResult)

        return jsonify(results)


