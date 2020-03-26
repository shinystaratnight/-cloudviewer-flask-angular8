from flask_restful import Resource
from flask import request
from database.models.user import UserModel
from flask_jwt_extended import (jwt_required, get_jwt_identity)

class ChangePassword(Resource):
    @jwt_required
    def post(self):
        password = request.json.get('password', None)
        new_password = request.json.get('new_password', None)
        confirm_password = request.json.get('confirm_password', None)

        if not request.is_json:
            return {"message": "Missing JSON in request"}, 200

        if password == "" or password is None:
            return {"message":"Password cannot be blank"}, 200

        if new_password == "" or new_password is None:
            return {"message":"New password cannot be blank"}, 200

        if new_password != confirm_password: 
            return {"message":"Password does not match"}, 200

        username = get_jwt_identity()
        print("username: {}".format(username))
        userInDB = UserModel.find_by_username(username)
        if(userInDB is None): 
            return {'message': 'user not found'}, 200


        verifyPassword = userInDB.verify_hash(password, userInDB.password)
        if verifyPassword:
            hashed_new_password = UserModel.generate_hash(new_password)
            try:
                userInDB.password = hashed_new_password
                userInDB.save_to_db()
                return {'message': 'password successfully changed!'}, 200
            except Exception as error: 
                return {'message': 'error changing password: {}'.format(error)}
        else:
            return {"message":"Username or password incorrect"}, 400
