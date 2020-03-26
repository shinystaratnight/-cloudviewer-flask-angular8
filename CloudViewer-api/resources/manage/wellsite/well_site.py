from flask_restful import Resource
from flask import request
from database.models.well_site import WellSiteModel
from database.models.well_site_detail import WellSiteDetailModel
from database.models.customer import CustomerModel
from flask_jwt_extended import (jwt_required, get_jwt_claims)
import datetime

class WellSite(Resource):

    # Add new wellsite
    @jwt_required
    def post(self, id):
        claims = get_jwt_claims()
        customerID = claims['customerID']

        # Jobs Info
        districtID = request.json.get('districtID', None)
        orderNumber = request.json.get('orderNumber', None)
        wellName = request.json.get('wellName', None)
        jobLocation = request.json.get('jobLocation', None)
        fracCrew = request.json.get('fracCrew', None)
        fieldTech = request.json.get('fieldTech', None)
        tankCount = request.json.get('tankCount', None)
        # jobStatus = request.json.get('jobStatus', None)
        memo = request.json.get('memo', None)
        requestedBy = request.json.get('requestedBy', None)
        # createdBy = request.json.get('createdBy', None)
        scheduledStartDate = request.json.get('scheduledStartDate', None)
        scheduledEndDate = request.json.get('scheduledEndDate', None)
        tankDeliveryDate = request.json.get('tankDeliveryDate', None)
        dateCreated = request.json.get('dateCreated', None)
        latitude = request.json.get('gpsLat', None)
        longitude = request.json.get('gpsLong', None)

        # Job_Detail Info
        # Fields not used by OTR
        # custrecDelivery = request.json.get('custRecDate', None)
        # termID = request.json.get('termID', None)
        # stage = request.json.get('stage', None)
        # tankEnable = request.json.get('tankEnable', None)
        # jobStart = request.json.get('jobStart', None)
        # jobEnd = request.json.get('jobEnd', None)
        # lastUpdate = request.json.get('lastUpdate', None)
        primaryTechID = request.json.get('primaryTechID', None)
        backupTech1ID = request.json.get('backupTech1ID', None)
        backupTech2ID = request.json.get('backupTech2ID', None)
        backupTech3ID = request.json.get('backupTech3ID', None)

        customer = CustomerModel.find_by_id(customerID)
        if customer is None:
            return {"message": "Customer not found"}, 404

        new_site = WellSiteModel(customer.customerID, districtID, orderNumber, wellName, 
        jobLocation, fracCrew, fieldTech, tankCount, "Pending", memo, None,
        requestedBy, customer.customerName, scheduledStartDate, scheduledEndDate, tankDeliveryDate,
        dateCreated, None, latitude, longitude)

        try:
            new_site.save_to_db()       # JobID added to new_site model during this operation
        except Exception as error:
            return {"message": "An error occurred saving site: {}".format(error)}, 500

        # Job Details Info
        # TODO: validate job ID and make a FK

        new_site_details = WellSiteDetailModel(new_site.jobID, None, None, None, latitude,
        longitude, None, None, datetime.datetime.utcnow(), primaryTechID, backupTech1ID, backupTech2ID, backupTech3ID)

        try:
            new_site_details.save_to_db()
        except Exception as error:
            return {"message": "An error occurred saving site details: {}".format(error)}, 500

        return new_site.json (), 201


    @jwt_required
    def get(self, id):
        well_site = WellSiteModel.find_by_id(id)
        if well_site:
            return well_site.json()
        return {'message': 'Site not found'}, 200

    # @jwt_required
    # def delete(self, id): 
    #     well_site = WellSiteModel.find_by_id(id)
    #     if well_site is None: 
    #         return {'message':'Site not found'}, 200
    #     else:
    #         try: 
    #             well_site.delete_from_db()
    #         except Exception as error:
    #             return {'message':'error deleting site: {}'.format(error)}, 500
        
    #     return {'message':'site {} deleted'.format(id)}, 200

    # Update wellsite
    @jwt_required
    def put(self, id):
        claims = get_jwt_claims()

        well_site = WellSiteModel.find_by_id(id)
        if well_site is None: 
            return {'message':'Site not found'}, 200

        well_site.customerID = claims['customerID']
        well_site.districtID = request.json.get('districtID', None)
        well_site.orderNumber = request.json.get('orderNumber', None)
        well_site.wellName = request.json.get('wellName', None)
        well_site.jobLocation = request.json.get('jobLocation', None)
        well_site.fracCrew = request.json.get('fracCrew', None)
        well_site.fieldTech = request.json.get('fieldTech', None)
        well_site.tankCount = request.json.get('tankCount', None)
        well_site.jobStatus = request.json.get('jobStatus', None)
        well_site.memo = request.json.get('memo', None)
        well_site.requestedBy = request.json.get('requestedBy', None)
        well_site.scheduledStartDate = request.json.get('scheduledStartDate', None)
        well_site.scheduledEndDate = request.json.get('scheduledEndDate', None)
        well_site.tankDeliveryDate = request.json.get('tankDeliveryDate', None)
        well_site.dateCreated = request.json.get('dateCreated', None)
        well_site.latitude = request.json.get('gpsLat', None)
        well_site.longitude = request.json.get('gpsLong', None)

        try: 
            well_site.save_to_db()
        except Exception as error:
            return {'message':'error updating site: {}'.format(error)}, 500

        return well_site.json() 

# class WellSiteList(Resource):
#     @jwt_required
#     def get(self):
#         return {'Well sites': list(map(lambda x: x.json(), WellSiteModel.query.all()))}


