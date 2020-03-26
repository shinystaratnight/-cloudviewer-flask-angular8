from flask_restful import Resource
from database.models.user import UserModel

class UserValidate(Resource): 
    def get(self, username):
        user = UserModel.find_by_username(username)
        if user:
            return {'message': 'user already exists'}, 200
        return {'message': 'user not found'}, 200
