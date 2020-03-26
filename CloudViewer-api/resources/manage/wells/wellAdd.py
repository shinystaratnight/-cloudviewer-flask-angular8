from flask_restful import Resource
from flask_jwt_extended import (jwt_required)
from flask import jsonify, request
from database import Session
from shared.enums import WellStatus

from database import WellInfoModel


class AddWell(Resource):
    @jwt_required
    def post(self):
        wellName = request.json.get("name")

        if wellName == "" or wellName is None:
            return 'A well name is required. Not adding well'

        # Make sure the well name is unique
        wellNameExists = Session.query(WellInfoModel).filter(WellInfoModel.wellName == wellName).first()
        if wellNameExists is not None:
            return 'Well name already exists, not adding record'

        newWell = WellInfoModel()
        newWell.wellName = wellName
        newWell.currentStage = 0
        newWell.status = WellStatus.Standby.name
        Session.add(newWell)
        Session.commit()

        Session.remove()
        return jsonify({'message': 'New well added',
                        'wellName': newWell.wellName,
                        'currentStage': newWell.currentStage,
                        'status': newWell.status})
