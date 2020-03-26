from flask_restful import Resource, reqparse
from database.models.user import UserModel
from database.models.user_role import UserRoleModel
from flask_jwt_extended import (jwt_required, get_jwt_claims)

class UserRole(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name', 
        type=str, 
        required=True, 
        help="This field cannot be left blank"
    )

    @jwt_required
    def get(self, name):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        user_role = UserRoleModel.find_by_name(name)
        
        if user_role:
            return user_role.json()
        return {'message': 'role not found'}, 200

    @jwt_required
    def post(self, name):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        if UserRoleModel.find_by_name(name):
            return {'message': "A user role with name '{}' already exists".format(name)}, 200

        new_user_role = UserRoleModel(name)
        
        try:
            new_user_role.save_to_db()
        except Exception as e:
            return {"message": "An error occurred inserting the user role, {}".format(e)}, 500

        return new_user_role.json(), 201

    @jwt_required
    def delete(self, name): 
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        user_role = UserRoleModel.find_by_name(name)
        if user_role:
            user_role.delete_from_db()
        
        return {'message':'User role deleted'}

    @jwt_required
    def put(self, name):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        data = UserRole.parser.parse_args()
        user_role = UserRoleModel.find_by_name(name)
        if user_role is None: 
            user_role = UserRoleModel(name)
        else:
            user_role.name = data['name']

        user_role.save_to_db()

        return user_role.json() 

class UserRoleList(Resource):
    @jwt_required
    def get(self):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        return {'user roles': list(map(lambda x: x.json(), UserRoleModel.query.all()))} 