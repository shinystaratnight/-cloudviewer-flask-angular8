from flask_restful import Resource
from database.models.user import UserModel
from database.models.customer import CustomerModel
from flask import request, jsonify
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class User(Resource):
    @jwt_required
    def get(self, username):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        user = UserModel.find_by_username(username)
        
        if user:
            return user.json()
        return {'message': 'user not found'}, 200

    @jwt_required
    def delete(self, username): 
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        user = UserModel.find_by_username(username)
        if user is None: 
            return {'message':'user not found'}, 200
        else:
            user.delete_from_db()
        
        return {'message':'user {} deleted'.format(username)}, 200

    @jwt_required
    def put(self, username):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        user = UserModel.find_by_username(username)
        if user is None: 
            return {'message':'user not found'}, 200
        else:
            user.username = request.json.get('username', None)
            user.password = request.json.get('password', None)
            user.email = request.json.get('email', None)
            user.accessLevel = request.json.get('accessLevel', None)
            user.companyID = request.json.get('companyID', None)
            user.districtID = request.json.get('districtID', None)

            try: 
                user.save_to_db()
            except Exception as error:
                return {'message':'error updating user: {}'.format(error)}, 500

        return user.json() 

    
class UserList(Resource):
    @jwt_required
    def get(self):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        users = UserModel.query.all()

        results = []
        for user in users:
            # Get company for user
            company = CustomerModel.find_by_id(user.companyID)
            coName= 'not assigned'
            if company is not None:
                coName = company.customerName

            item = {'userID': user.id,
                    'username': user.username,
                    'email': user.email,
                    'districtID': user.districtID,
                    'companyID': user.companyID,
                    'accessLevel': user.accessLevel,
                    'companyName': coName}

            results.append(item)

        return jsonify(results)