from flask_restful import Resource
from flask import request
from flask_jwt_extended import (jwt_required, get_jwt_claims)
from database.models.user import UserModel
from SendGrid.sendEmail import SendEmail
import string
from random import *


class UserAccountReset(Resource):
    def post(self):
        email = request.json.get('email', None)

        req = UserModel.find_by_email(email)
        if not req:
            return {'message': "Email '{}' not found".format(email)}, 200

        try:
            allchar = string.ascii_letters + string.digits
            ResetKey = "".join(choice(allchar) for x in range(50))
            UserModel.update_resetKey(ResetKey, req.id)

            emailSender = SendEmail()
            emailSender.sendSingleEmail(SendEmail.EmailTypes.PasswordReset, email, ResetKey)
            return {'message': "Email sent to '{}'".format(email)}, 200
        except Exception as ex:
            return {"message": "An error occurred saving request" + str(ex)}, 500

    def put(self):
        key = request.json.get('key', None)
        password = request.json.get('password', None)

        req = UserModel.find_by_resetKey(key)
        if not req:
            return {'message': "Key '{}' not found".format(key)}, 200

        try:
            UserModel.update_password(password, req.id)
            return {'message': "Password updated"}, 200
        except Exception as ex:
            return {"message": "An error occurred updating your password" + str(ex)}, 500
