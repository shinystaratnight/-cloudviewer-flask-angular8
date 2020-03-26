from flask_restful import Resource
from database.models.asset import AssetModel
from mongodb.mongoHistorian import MongoHistorian
from flask_jwt_extended import (jwt_required, get_jwt_claims)


class GetPointsSimple(Resource):
    @jwt_required
    def get(self):
        claims = get_jwt_claims()
        custId = claims['customerID']

        mongo = MongoHistorian()

        assets = AssetModel.get_assets_by_custId(custId)

        # Put devices into a dictionary
        assetsDict = {}
        for item in assets:
            assetsDict[item.id] = item.name

        retVal = mongo.getDevicePointsSimple(assetsDict)

        return retVal