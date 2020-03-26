from flask_restful import Resource
from flask_jwt_extended import (jwt_required)
from flask import jsonify
from database import Session
from database.models.appInfo import AppInfoModel


class AppInfo(Resource):
    @jwt_required
    def get(self):
        value = Session.query(AppInfoModel).filter().first()

        results = [{'appName': value.appName,
                    'appVersion': value.appVersion,
                    'terminalID': value.terminalID,
                    'strappingURL': value.strappingURL
                    }]

        Session.remove()
        return jsonify(results)

