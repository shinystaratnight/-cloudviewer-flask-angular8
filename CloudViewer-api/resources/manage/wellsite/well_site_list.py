from flask_restful import Resource
from flask import jsonify
from database.models.well_site import WellSiteModel
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class WellSiteListModel(Resource):
    @jwt_required
    def get(self):
        claims = get_jwt_claims()
        custId = claims['customerID']

        results = []
        wellsites = WellSiteModel.get_by_custId(custId)
        for wellsite in wellsites:
            item = {"id": wellsite.jobID,
                    "name": wellsite.wellName,
                    "orderNumber": wellsite.orderNumber,
                    "location": wellsite.jobLocation,
                    "latitude": wellsite.latitude,
                    "longitude": wellsite.longitude,
					"state": wellsite.jobStatus}
            results.append(item)

        return jsonify(results)