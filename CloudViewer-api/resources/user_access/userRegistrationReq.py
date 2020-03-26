from flask_restful import Resource
from database.models.userRegistrationReq import UserRegistrationRequestModel
from flask import request
from flask_jwt_extended import (jwt_required, get_jwt_claims)
from database.models.user import UserModel
from SendGrid.sendEmail import SendEmail

class UserRegistrationRequest(Resource):
    # Add
    def post(self):
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        email = request.json.get('email', None)
        phone = request.json.get('phone', None)
        companyName = request.json.get('companyName', None)

        req = UserRegistrationRequestModel.find_by_username(username)
        if req:
            return {'message': "Username'{}' already exists".format(username)}, 200

        validate_email = self.validate_email(email)

        if not validate_email: 
            return {'message': "Incorrect email format"}, 200 

        new_req = UserRegistrationRequestModel(username, password, email, phone, companyName)
        
        try:
            new_req.save_to_db()
            emailSender = SendEmail()
            emailSender.sendSingleEmail(SendEmail.EmailTypes.accountUnderReview, email)
        except:
            return {"message": "An error occurred saving request"}, 500

        return new_req.json (), 201


    @jwt_required
    def get(self, username):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        req = UserRegistrationRequestModel.find_by_username(username)
        
        if req:
            return req.json()
        return {'message': 'request not found'}, 200


    # Delete
    @jwt_required
    def delete(self, username): 
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        req = UserRegistrationRequestModel.find_by_username(username)
        if req:
            req.delete_from_db()
        
        return {'message':'request deleted'}, 201

    # Modify or approve
    @jwt_required
    def put(self, username):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        req = UserRegistrationRequestModel.find_by_username(username)
        if req is None: 
            return {'message':'request not found'}, 200
        else:
            req.username = request.json.get('username', None)
            req.password = request.json.get('password', None)
            req.email = request.json.get('email', None)
            req.companyName = request.json.get('companyName', None)

            try: 
                req.save_to_db()
            except Exception as error:
                return {'message':'error updating request: {}'.format(error)}, 500

        return req.json() 

    def validate_email(self, email):
        return True
        # if re.match("\A(?P<name>[\w\-_]+)@(?P<domain>[\w\-_]+).(?P<toplevel>[\w]+)\Z",email,re.IGNORECASE):
        #     return True
        # else:
        #     return False

class UserRegistrationRequestList(Resource):
    @jwt_required
    def get(self): 
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        return {'registration requests': list(map(lambda x: x.json(), UserRegistrationRequestModel.query.all()))} 