from flask_restful import Resource
from flask import jsonify
from flask_jwt_extended import (jwt_required)


class GetAlarmLevels(Resource):
    @jwt_required
    def get(self):

        results = {"level": 1, "name": "Low"}, {"level": 2, "name": "Medium"}, {"level": 3, "name": "High"}

        return jsonify(results)