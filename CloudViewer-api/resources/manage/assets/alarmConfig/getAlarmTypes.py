from flask_restful import Resource
from flask import jsonify
from database.models.alarmTypes import AlarmTypesModel
from flask_jwt_extended import (jwt_required)

class GetAlarmTypes(Resource):
    @jwt_required
    def get(self):
        alarm_types = AlarmTypesModel.get_alarm_types()

        results = [{"id": at.id,
                    "name": at.name} for at in alarm_types]

        return jsonify(results)



