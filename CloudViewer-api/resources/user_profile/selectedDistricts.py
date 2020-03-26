from flask_restful import Resource
from flask import request
from database.models.user import UserModel
from flask_jwt_extended import (jwt_required, get_jwt_identity)

class SelectedDistricts(Resource):
    @jwt_required
    def get(self):
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        if user is None:
            return {'message': 'user not found'}, 200
        else:
            districts = [
                {
                    'id': 6,
                    'customerID': user.id,
                    'name': "My District 6",
                    'comment': "My District 6"
                },
                {
                    'id': 7,
                    'customerID': user.id,
                    'name': "My District 7",
                    'comment': "My District 7"
                },
                {
                    'id': 8,
                    'customerID': user.id,
                    'name': "My District 8",
                    'comment': "My District 8"
                }
            ]

            return districts, 200