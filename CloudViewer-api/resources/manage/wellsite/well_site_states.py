from flask_restful import Resource
from flask import jsonify
from database.models.otrState import OTRState
from flask_jwt_extended import (jwt_required)

class WellSiteStates(Resource):

    # Add new wellsite
    @jwt_required
    def get(self):

        states = OTRState.get_wellsite_states()

        results = [{"id": state.stateID,
                    "name": state.name} for state in states]

        return jsonify(results)
