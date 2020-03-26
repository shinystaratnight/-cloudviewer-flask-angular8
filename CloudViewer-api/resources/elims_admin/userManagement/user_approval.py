from flask_restful import Resource
from flask import request
from database.models.userRegistrationReq import UserRegistrationRequestModel
from database.models.user import UserModel
from database.models.customer import CustomerModel
from flask_jwt_extended import (jwt_required, get_jwt_claims)
from SendGrid.sendEmail import SendEmail

class UserApproval(Resource):

    # Approve user
    @jwt_required
    def post(self):

        # Make sure the user for this post as adequate permissions
        claims = get_jwt_claims()
        userAccessLevel = claims['accessLevel']
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        registrationId = request.json.get('registrationID', None)
        districtID = request.json.get('districtID', None)
        status = request.json.get('status', None)
        companyID = request.json.get('companyID', None)
        accessLevel = request.json.get('accessLevel', None)

        # Make sure we have all the data to convert from registration to user account
        if accessLevel is None or registrationId == "":
            return {'message': 'please provide access level'}

        if registrationId is None or registrationId == "":
            return {'message': 'please provide a registrationID'}

        if districtID is None or districtID =="":
            return {'message': 'please provide a districtID'}

        if status is None or status == "":
            return {'message': 'please provide a status'}

        if companyID is None or companyID == "":
            return {'message': 'please provide a companyID'}

        # Check if use was approved or denied
        if(status == 'approve'):
            response = self.approve(districtID, registrationId, companyID, accessLevel)
        else:
            response = self.reject(registrationId)

        return response

    # *****************  Private functions ********************************
    def approve(self, districtID, req_id, companyID, accessLevel):

        # Get necessary parameters from registration request
        RegRequest = UserRegistrationRequestModel.find_by_id(req_id)
        if RegRequest is None:
            return {'message': 'request not found'}, 200

        # Check to make sure there is a valid company ID
        company = CustomerModel.find_by_id(companyID)
        if company is None:
            return {'message': 'company not found '}, 200

        # TODO: Validate the accessLevel
        # TODO: Validate the districtId

        new_user = UserModel(RegRequest.username, RegRequest.password, RegRequest.email, accessLevel, companyID, districtID, RegRequest.phone)

        userCreated = False
        try:
            new_user.save_to_db()
            userCreated = True
            emailSender = SendEmail()
            emailSender.sendSingleEmail(SendEmail.EmailTypes.accountApproved, new_user.email)
        except Exception as error:
            return {'message': 'Something went wrong when creating user: {}'.format(error)}, 500

        if userCreated:
            try:
                RegRequest.delete_from_db()
            except Exception as error:
                return {'message': 'Something went wrong when deleting request: {}'.format(error)}, 500

            return {'message': 'User {} registered successfully!'.format(new_user.username)}, 201


    def reject(self, req_id):
        ur_request = UserRegistrationRequestModel.find_by_id(req_id)
        if ur_request is None: 
            return {'message': 'request not found'}, 200

        username = ur_request.username
        ur_request.status = 'rejected'
        ur_request.save_to_db()
        return {'message': 'Application for user {} was rejected'.format(username)}, 200