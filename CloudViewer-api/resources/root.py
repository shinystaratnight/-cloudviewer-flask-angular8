from flask_restful import Resource
from flask import jsonify, request
from database.models.asset import AssetModel
from database.models.well_site import WellSiteModel
from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required)

class Root(Resource):

    def get(self):
        return {'message': 'root response'}, 200