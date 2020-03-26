from flask_restful import Resource
from flask_jwt_extended import (jwt_required)
from flask import request
from database import Session

from database import WellInfoModel


class DeleteWell(Resource):
    @jwt_required
    def post(self):
        wellID = request.json.get("wellID")
        if wellID < 1 or wellID is None:
            return 'Well ID cannot be blank, cannot delete well'

        wellToDelete = Session.query(WellInfoModel).filter(WellInfoModel.id == wellID).first()
        if wellToDelete is None:
            return 'Cannot find well in database, cannot delete'

        Session.delete(wellToDelete)
        Session.commit()

        Session.remove()
        return 'Well deleted'