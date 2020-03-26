from flask_restful import Resource
from flask import request
from database.models.tank import TankModel
from database.models.inventory_customer_product_name import InventoryCustomerProductNameModel
from database.models.user import UserModel
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt_claims)

class Tank(Resource): 
    @jwt_required
    def post(self, id):
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        claims = get_jwt_claims()

        if(user is None): 
            return {'message': 'user not found'}, 200

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        tankID = request.json.get('tankID', None)
        jobID = request.json.get('jobID', None)
        tankNumber = request.json.get('tankNumber', None)
        tankType = request.json.get('tankType', None)
        productDesc = request.json.get('productDesc', None)
        tankStatus = request.json.get('tankStatus', None)
        tankLevel = request.json.get('tankLevel', None)
        tankPercent = request.json.get('tankPercent', None)
        productAdded = request.json.get('productAdded', None)
        productUsed = request.json.get('productUsed', None)
        stageUsed = request.json.get('stageUsed', None)
        notifyLevel = request.json.get('notifyLevel', None)
        volts = request.json.get('volts', None)
        commsRate = request.json.get('commsRate', None)
        io = request.json.get('io', None)
        radioSignal = request.json.get('radioSignal', None)
        lastUpdate = request.json.get('lastUpdate', None)
        chemicalID = request.json.get('chemicalID', None)
        trailerNumber = request.json.get('trailerNumber', None)

        ncpn = InventoryCustomerProductNameModel.find_by_id(chemicalID)
        if ncpn is None:
            return {"message": "ChemicalID not found"}, 200

        #validate job ID and make a FK 
        new_tank = TankModel(jobID, tankNumber, tankType, productDesc, tankStatus, tankLevel, 
        tankPercent, productAdded, productUsed, stageUsed, notifyLevel, volts, commsRate, 
        io, radioSignal, ncpn.Id, trailerNumber)

        try:
            new_tank.save_to_db()
        except Exception as error:
            return {"message": "An error occurred saving tank: {}".format(error)}, 500

        return new_tank.json (), 201

    @jwt_required
    def get(self, id):
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        claims = get_jwt_claims()
        if(user is None): 
            return {'message': 'user not found'}, 200

        userAccessLevel = claims['accessLevel']
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403


        tank = TankModel.find_by_id(id)
        if tank:
            return tank.json()
        return {'message': 'tank not found'}, 200

    @jwt_required
    def delete(self, id): 
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        claims = get_jwt_claims()
        
        if(user is None): 
            return {'message': 'user not found'}, 200

        userAccessLevel = claims['accessLevel']

        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403
       
        tank = TankModel.find_by_id(id)
        if tank is None: 
            return {'message':'tank not found'}, 200
        else:
            try: 
                tank.delete_from_db()
            except Exception as error:
                return {'message':'error deleting tank: {}'.format(error)}, 500
        
        return {'message':'tank {} deleted'.format(id)}, 200

    @jwt_required
    def put(self, id):
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        claims = get_jwt_claims()
        if(user is None): 
            return {'message': 'user not found'}, 200

        userAccessLevel = claims['accessLevel']
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403
       
        tank = TankModel.find_by_id(id)
        if tank is None: 
            return {'message':'tank not found'}, 200
        else:
            tank.jobID = request.json.get('jobID', None)
            tank.tankNumber = request.json.get('tankNumber', None)
            tank.tankType = request.json.get('tankType', None)
            tank.productDesc = request.json.get('productDesc', None)
            tank.tankStatus = request.json.get('tankStatus', None)
            tank.tankLevel = request.json.get('tankLevel', None)
            tank.tankPercent = request.json.get('tankPercent', None)
            tank.productAdded = request.json.get('productAdded', None)
            tank.productUsed = request.json.get('productUsed', None)
            tank.stageUsed = request.json.get('stageUsed', None)
            tank.notifyLevel = request.json.get('notifyLevel', None)
            tank.volts = request.json.get('volts', None)
            tank.commsRate = request.json.get('commsRate', None)
            tank.io = request.json.get('io', None)
            tank.radioSignal = request.json.get('radioSignal', None)
            tank.lastUpdate = request.json.get('lastUpdate', None)
            tank.chemicalID = request.json.get('chemicalID', None)
            tank.trailerNumber = request.json.get('trailerNumber', None)

            try: 
                tank.save_to_db()
            except Exception as error:
                return {'message':'error updating tank: {}'.format(error)}, 500

        return tank.json() 


class TankList(Resource):
    @jwt_required
    def get(self): 
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        claims = get_jwt_claims()

        if(user is None): 
            return {'message': 'user not found'}, 200

        userAccessLevel = claims['accessLevel']

        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403
       
        return {'Tanks': list(map(lambda x: x.json(), TankModel.query.all()))} 

        