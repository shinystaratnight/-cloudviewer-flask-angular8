from flask_restful import Resource
from database.models.district import DistrictModel
from flask import request, jsonify
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class DistrictsCustomer(Resource):
    @jwt_required
    def get(self):
        claims = get_jwt_claims()
        customerID = claims['customerID']

        custDistricts = DistrictModel.find_by_customer_id(customerID)

        if custDistricts is None:
            return {'message': 'customer does not have any distrcts'}, 201


        results = [{"id": dist.districtID,
                    "name": dist.districtName} for dist in custDistricts]

        return jsonify(results)
