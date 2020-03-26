from flask_restful import Resource
from flask_jwt_extended import (jwt_required)
from flask import jsonify, request
from database import Session

from database import WellInfoModel


class EditWell(Resource):
    @jwt_required
    def post(self):
        wellID = request.json.get("wellID")
        wellName = request.json.get("wellName")

        if wellID < 1 or wellID is None:
            return 'Well ID cannot be blank, cannot edit well'

        if wellName == "" or wellName is None:
            return 'Well name cannot be blank, cannot edit well'

        wellToUpdate = Session.query(WellInfoModel).filter(WellInfoModel.id == wellID).first()
        if wellToUpdate is None:
            return 'Well could not be found in database, cannot edit weill'

        wellToUpdate.wellName = wellName
        Session.commit()

        Session.remove()
        return jsonify({'message': 'Well name updated',
                        'wellName': wellToUpdate.wellName})
