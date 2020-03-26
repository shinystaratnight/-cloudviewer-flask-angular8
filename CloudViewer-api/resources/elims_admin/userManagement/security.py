from werkzeug.security import safe_str_cmp
from database import UserModel
from flask import request, jsonify, make_response
# from flask_api import status
from flask_jwt_extended import (create_access_token)
from flask_restful import Resource
from database import Session
from datetime import timedelta


class Security(Resource):
    # @da.route('/auth', methods=['POST'])
    def post(self):
        username = request.json.get('username', None)
        password = request.json.get('password', None)

        if not request.is_json:
            return {"message": "Missing JSON in request"}, 200

        if username =="" or username is None:
            return "Username cannot be blank", 200

        if password == "" or password is None:
            return "Password cannot be blank", 200

        # user = UserModel.find_by_username(username)
        userInDB = Session.query(UserModel).filter(UserModel.username == username).first()

        if not (userInDB and safe_str_cmp(userInDB.password, password)):
            return "Username or password incorrect", 400

        expires = timedelta(days=180)
        access_token = create_access_token(identity=username, expires_delta=expires) # , expires_delta=False)

        # return jsonify(access_token=access_token, accessLevel=userInDB.accessLevel)

        data = jsonify(access_token=access_token, accessLevel=userInDB.accessLevel)

        response = make_response(data, 200)
        response.mimetype = 'app/json'

        Session.remove()
        return data



        #return access_token, 200
        # user = UserModel.find_by_username(username)
        # if user and safe_str_cmp(user.password, password):
        #     return user


    def identity(payload):
        user_id = payload['identity']
        return UserModel.find_by_id(user_id)




