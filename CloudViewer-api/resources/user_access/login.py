# from flask_restful import Resource
from flask import request
# from werkzeug.security import safe_str_cmp
# from database.base import Session
from datetime import timedelta
from flask_restful import Resource
import re
from database.models.user import UserModel
from flask_jwt_extended import (
    create_access_token
)


class Login(Resource):
    def post(self):
        try:
            username = request.json.get('username', None)
            password = request.json.get('password', None)

            if not request.is_json:
                return {"message": "Missing JSON in request"}, 200

            if username == "" or username is None:
                return {'message': 'Username or password cannot be blank'}, 200

            if password == "" or password is None:
                return {'message': 'Password cannot be blank'}, 200

            validate_email = self.validate_email(username)

            if (validate_email):
                userInDB = UserModel.find_by_email(username)
            else:
                userInDB = UserModel.find_by_username(username)

            if (userInDB is None):  # is this a good idea?
                return {'message': 'user not found'}, 200

            verifyPassword = UserModel.verify_hash(password, userInDB.password)
            if verifyPassword:
                expires = timedelta(days=180)
                access_token = create_access_token(identity=userInDB.username,
                                                   expires_delta=expires)  # , expires_delta=False)

                # data = jsonify(access_token=access_token, accessLevel=userInDB.accessLevel)

                return {
                           # 'message': 'Logged in as {}'.format(userInDB.username),
                           # 'access level': userInDB.accessLevel,
                           'access_token': access_token,
                       }, 200
            else:
                return {'message': "Username or password incorrect"}, 200
        except Exception as ex:
            print(str(ex))


    def identity(payload):
        user_id = payload['identity']
        return UserModel.find_by_id(user_id)

    def validate_email(self, email):
        if re.match("\A(?P<name>[\w\-_]+)@(?P<domain>[\w\-_]+).(?P<toplevel>[\w]+)\Z", email, re.IGNORECASE):
            return True
        else:
            return False
