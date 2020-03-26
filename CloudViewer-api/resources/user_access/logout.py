from flask_restful import Resource
from database.models.revoked_token import RevokedTokenModel
from flask_jwt_extended import (jwt_required,
                                get_raw_jwt)
                                
class UserLogout(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {'message': 'Logged out'}
        except:
            return {'message': 'Something went wrong'}, 500