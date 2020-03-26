import pymongo
import ssl
import pprint
import json
from flask import jsonify
import datetime


class MongoHistorian:

    client = None
    db = None

    @classmethod
    def __init__(cls):
        cls.client = pymongo.MongoClient("mongodb+srv://Elims:Maggie123@mongocluster0-yiogz.mongodb.net/test?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
        cls.db = cls.client.deviceData


# *******************************  Public Functions *************************************************

    @classmethod
    def getDevicePointsSimple(cls, assetDict):
        try:
            collection = cls.db.devicePoints
            retVal = []
            x = 9

            for assetId in assetDict.keys():

                newAsset = {"assetId": assetId, "assetName": assetDict[assetId]}
                newAsset["devicePoints"] = []

                # the the devicePoints for the assetID
                # devicePoints = collection.find({"assetId": assetId})
                for item in collection.find({"assetId": assetId}, {"_id": 0, "deviceId": 1, "pointId": 1, "deviceName": 1, "pointName": 1}):
                    newAsset["devicePoints"].append(item)

                retVal.append(newAsset)

            return retVal

        except Exception as ex:
            return None



    @classmethod
    def addAsset(cls, name, termId, satId, assetType, leasedCustId, status, state, latitude, longitude):
        try:
            collection = cls.db.assets
            collection.insert_one({"id":1,
                                   "custId": leasedCustId,
                                   "name": name,
                                   "termId": termId,
                                   "satId": satId,
                                   "type": assetType,
                                   "status": status,
                                   "state": state,
                                   "latitude": latitude,
                                   "longitude": longitude})

        except Exception as ex:
            print('Error in addAsset: ' + str(ex) )


    @classmethod
    def updateDeviceName(cls, assetId, deviceId, updatedDeviceName):
        try:
            collection = cls.db.devicePoints
            collection.update_many({"assetId": assetId, "deviceId": deviceId},
                                   {"$set": {"deviceName": updatedDeviceName}})

        except Exception as ex:
            return None


    @classmethod
    def deleteDevice(cls, assetId, deviceId):
        try:
            # 1st - delete historical data
            collection = cls.db.pointsData
            filter = {"assetId": assetId, "deviceId": deviceId}
            collection.delete_many(filter)

            # 2nd - delete devicePoint
            collection = cls.db.devicePoints
            collection.delete_many(filter)

        except Exception as ex:
            print('Error in deleteDevice:' + str(ex))


    @classmethod
    def getRTForAsset(cls, assetId):
        try:
            retVal = []
            collection = cls.db.devicePoints
            filter = {"assetId": assetId}
            project = {"$project": {"pointName": 1, "currVal": 1, "lastUpdate": 1, "deviceName": 1}}

            for val in collection.find(filter):
                retVal.append({"deviceId": val["deviceId"], "pointId": val["pointId"],  "pointName": val["pointName"], "deviceName": val["deviceName"], "currVal": val["currVal"], "lastUpdate": val["lastUpdate"]})

            print(retVal)
            return retVal

        except Exception as ex:
            return None


    @classmethod
    def getPointsForAsset(cls, custId, assetId, assetName, assetType):
        try:
            retVal = []
            collection = cls.db.devicePoints
            filter = {"custId": custId, "assetId": assetId}
            project = {}

            for point in collection.find(filter):
                name = assetType + '.' + assetName + '.' + point["deviceName"] + '.' + point["pointName"]
                retVal.append({"assetId": assetId, "deviceId": point["deviceId"], "pointId": point["pointId"], "name": name})

            return retVal

        except Exception as ex:
            print('Error in getPointsForAsset ' + str(ex))


    @classmethod
    def getHistForPoint(cls, assetId, deviceId, pointId, start, end):
        try:
            retVal = []
            print('made it to getHistForPoint')
            collection = cls.db.pointsData

            # test = datetime.datetime(2019, 8, 23)
            # test2 = datetime.datetime(2019, 9, 10)
            startTS = datetime.datetime.strptime(start, '%Y-%m-%d %H:%M:%S')
            endTS = datetime.datetime.strptime(end, '%Y-%m-%d %H:%M:%S')

            filter ={"assetId": assetId, "deviceId": deviceId, "pointId": pointId, "day": {"$gte": startTS, "$lte": endTS}}

            for val in collection.find(filter):
                for point in val["samples"]:
                    retVal.append(point)

            return retVal

        except Exception as ex:
            return None

# ******************************* Not Used ********************************************

    @classmethod
    def getDevicePoints(cls, assetsDict):

        try:
            retDict = []

            collection = cls.db.devicePoints

            for assetId in assetsDict.keys():

                # Make dictionary of points for deviceID
                pointsDic = []
                for item in collection.find({"assetId": assetId}):
                    newPoint = PointInfo(item["pointId"], item["pointName"])
                    pointsDic.append(newPoint)

                # Make an object to hold the deviceName and points
                if len(pointsDic) > 0:
                    DevicePointInfo = DeviceInfo(assetId, assetsDict[assetId], pointsDic)

                    # Add to return dictionary
                    retDict.append(DevicePointInfo)


            return retDict

        except Exception as ex:
            return None





class DeviceInfo:
    deviceName = None
    deviceId = None
    points = []

    def __init__(self, deviceId, deviceName, points):
        self.deviceId = deviceId
        self.deviceName = deviceName
        self.points = points


class PointInfo:
    name = None
    id = 0

    def __init__(self, pointId, pointName ):
        self.name = pointName
        self.id = pointId