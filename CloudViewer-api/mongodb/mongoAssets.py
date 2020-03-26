from mongodb.mongoBase import MongoBase
import datetime
import binascii
import logging


class MongoAlarms(MongoBase):

    collection = None
    logger = None

    def __init__(self):
        MongoBase.__init__(self)
        self.db = self.client.deviceData
        self.collection = self.db.assets
        self.logger = logging.getLogger()


    def get_assets_by_cust(self, custId):
        try:
            x = 7
        except Exception as ex:
            self.logger.error('Error in get_assets_by_custId' + str(ex))


    def create_asset(self, terminalSN, satSN, name, status, state, activeWellsite, latitude, longitude, lastUpdate, assetType, custId):
        try:
            record = {"terminanSN": terminalSN, "satSN": satSN, "name": name, "leasedCustId": 1046, "status": "Stand Still", "state": "Standby", "activeWellSite": "Not assigned", "latitude": 0.9, "longitude": 0.9, "assetType": assetType}
            self.collection.insert_one(record)
        except Exception as ex:
            self.logger.error('Error in create_asset:' + str(ex))