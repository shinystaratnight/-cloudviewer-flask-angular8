from flask_restful import Resource
from flask import request
from database.models.well_site import WellSiteModel
from database.models.well import WellModel
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class Well(Resource): 
    @jwt_required
    def post(self, id):
        claims = get_jwt_claims()

        jobID = request.json.get('jobID', None)
        wellName = request.json.get('wellName', None)
        currentStage = request.json.get('currentStage', None)
        status = request.json.get('status', None)
        api = request.json.get('api', None)
        customerID = claims['customerID']

        # best way to find if well exists?

        # well = WellModel.find_by_id(customerID)
        # if customer is None:
        #     return {"message": "Customer not found"}, 200

        if jobID == "" or jobID is None:
            return {'message': 'jobID cannot be blank'}, 200

        well_site = WellSiteModel.find_by_id(jobID)
        if well_site is None:
            return {'message': 'well site not found'}, 404

        new_well = WellModel(jobID, wellName, currentStage, status, api, customerID)

        try:
            new_well.save_to_db()
        except Exception as error:
            return {"message": "An error occurred saving well: {}".format(error)}, 500

        return new_well.json(), 201


    @jwt_required
    def get(self, id): 
        well = WellModel.find_by_id(id)
        if well: 
            return well.json()
        return {'message': 'Well not found'}, 404

    @jwt_required
    def delete(self, id): 
        well = WellModel.find_by_id(id)
        if well is None: 
            return {'message':'Well not found'}, 404
        else:
            try: 
                well.delete_from_db()
            except Exception as error:
                return {'message':'error deleting well: {}'.format(error)}, 500
        
        return {'message':'well {} deleted'.format(id)}, 200

    @jwt_required
    def put(self, id):
        
        well = WellModel.find_by_id(id)
        if well is None: 
            return {'message':'Well not found'}, 404

        claims = get_jwt_claims()

        well.customerID = claims['customerID']
        well.jobID = request.json.get('jobID', None)
        well.wellName = request.json.get('wellName', None)
        well.currentStage = request.json.get('currentStage', None)
        well.status = request.json.get('status', None)
        well.api = request.json.get('api', None)

        try: 
            well.save_to_db()
        except Exception as error:
            return {'message':'error updating site: {}'.format(error)}, 500

        return well.json() 

# class WellList(Resource):
#     @jwt_required
#     def get(self):
#         return {'Wells': list(map(lambda x: x.json(), WellModel.query.all()))}


            
    