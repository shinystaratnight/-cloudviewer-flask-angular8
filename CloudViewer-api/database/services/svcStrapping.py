from database import Session

from database import StrapPointsModel


class SvcStrapping():

    def getstrapPoints(self, strapTableID):
        retVal = {}

        # need to add an order by inches
        strapPoints = Session.query(StrapPointsModel).filter(StrapPointsModel.strapID == strapTableID).order_by(StrapPointsModel.inches)

        for point in strapPoints:
            retVal[point.inches] = point.gallons

        # print(retVal)
        return retVal
