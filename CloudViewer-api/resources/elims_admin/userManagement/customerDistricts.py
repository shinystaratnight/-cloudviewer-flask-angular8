from flask_restful import Resource, reqparse
from flask import jsonify
from flask_jwt_extended import (jwt_required, get_jwt_claims)
from database.models.district import DistrictModel


class GetCustomerDistricts(Resource):

    @jwt_required
    def get(self, custId):
        claims = get_jwt_claims()
        adminId = claims['customerID']

        # TODO: Make sure user is elims admin

        results = []
        districts = DistrictModel.find_by_customer_id(custId)
        for district in districts:
            item = {'districtId': district.districtID,'districtName': district.districtName}

            results.append(item)

        return jsonify(results)




