from flask_restful import Resource
from flask import request
from database.models.user import UserModel
from flask_jwt_extended import (jwt_required, get_jwt_identity)

class AddDistrict(Resource):
    @jwt_required
    def put(self, id):
        username = get_jwt_identity()
        user = UserModel.find_by_username(username)
        if user is None:
            return {'message': 'user not found'}, 200
        else:
            districts = [
                {
                    'id': 1,
                    'customerID': user.id,
                    'name': "My District 1",
                    'comment': "My District 1 comment"
                },
                {
                    'id': 2,
                    'customerID': user.id,
                    'name': "My District 2",
                    'comment': "My District 2 comment"
                },
                {
                    'id': 3,
                    'customerID': user.id,
                    'name': "My District 3",
                    'comment': "My District 3 comment"
                },
                {
                    'id': 4,
                    'customerID': user.id,
                    'name': "My District 4",
                    'comment': "My District 4 comment"
                },
                {
                    'id': 5,
                    'customerID': user.id,
                    'name': "My District 5",
                    'comment': "My District 5 comment"
                }
            ]

        return districts[id], 200
