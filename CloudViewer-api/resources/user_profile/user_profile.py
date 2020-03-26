from flask_restful import Resource
from flask import request
from database.models.user import UserModel
from flask_jwt_extended import (jwt_required, get_jwt_identity)

class UserProfile(Resource): 
    @jwt_required
    def get(self):
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        if user:
            return user.json(), 200
        return {'message': 'user not found'}, 200

    @jwt_required
    def put(self):
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        if user is None: 
            return {'message':'user not found'}, 200
        else:
            # user.email = request.json.get('email', None)
            # user.companyID = request.json.get('companyID', None)
            # user.districtID = request.json.get('districtID', None)
            user.phone = request.json.get('phone', None)

            try: 
                user.save_to_db()
            except Exception as error:
                return {'message':'error updating user: {}'.format(error)}, 500

        return user.json() 