from mongodb.mongoBase import MongoBase
import datetime
import binascii


class MongoSQLAssets(MongoBase):

    collection = None

    def __init__(self):
        MongoBase.__init__(self)
        self.db = self.client.deviceData
        self.collection = self.db.devicePoints

    def updateLeasedCust(self, assetId, newCustLeasedId):
        try:
            filter = {"assetId": assetId}
            update = {"$set": {"custId": newCustLeasedId}}
            self.collection.update_many(filter, update)
        except Exception as ex:
            print('Error in ')