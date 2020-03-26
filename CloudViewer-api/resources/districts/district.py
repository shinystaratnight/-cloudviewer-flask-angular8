from flask_restful import Resource
from database.models.district import DistrictModel
from flask import request
from flask_jwt_extended import (jwt_required)

class District(Resource):
    @jwt_required
    def post(self, name):
        customerID = request.json.get('customerID', None) #customer name maybe?
        comment = request.json.get('comment', None)

        district = DistrictModel.find_by_name(name)
        if district:
            return {'message': "District'{}' already exists".format(name)}, 200

        new_district = DistrictModel(customerID, name, comment)

        try:
            new_district.save_to_db()
        except:
            return {"message": "An error occurred saving district"}, 500

        return new_district.json (), 201

    @jwt_required
    def get(self, name):
        district = DistrictModel.find_by_name(name)
        if district:
            return district.json()
        return {'message': 'district not found'}, 200

    @jwt_required
    def delete(self, name):
        district = DistrictModel.find_by_name(name)
        if district is None: 
            return {'message':'district not found'}, 200
        else:
            try: 
                district.delete_from_db()
            except Exception as error:
                return {'message':'error deleting district: {}'.format(error)}, 500
        
        return {'message':'district {} deleted'.format(name)}, 200

    @jwt_required
    def put(self, name):
        district = DistrictModel.find_by_name(name)
        if district is None: 
            return {'message':'district not found'}, 200
        else:
            district.districtName = request.json.get('district', None)
            district.customerID = request.json.get('customerID', None) 
            district.comment = request.json.get('comment', None)

            try: 
                district.save_to_db()
            except Exception as error:
                return {'message':'error updating district: {}'.format(error)}, 500

        return district.json() 

class DistrictList(Resource):
    @jwt_required
    def get(self): 
        return {'districts': list(map(lambda x: x.json(), DistrictModel.query.all()))} 