from mongodb.mongoBase import MongoBase
import datetime
import binascii


class MongoAlarms(MongoBase):

    collection = None

    def __init__(self):
        MongoBase.__init__(self)
        self.db = self.client.deviceData
        self.collection = self.db.devicePoints

    # @classmethod
    def GetAlarmsForAsset(self, custId, assetId, assetType, assetName):
        try:
            retVal = []

            for item in self.collection.find({"custId": custId, "assetId": assetId, "alarms": {"$exists": True}}):
                # Extract alarms
                for alarm in item["alarms"]:

                    thingToAdd = {'assetId': item['assetId'],
                             'deviceId': item['deviceId'],
                             'pointId': item['pointId'],
                             'alarmId': alarm['alarmId'],
                             'pointName': assetType + "." + assetName + "." + item["deviceName"] + "." + item["pointName"],
                             'alarmName': alarm["alarmName"],
                             'alarmText': alarm["alarmText"],
                             'alarmSetpoint': alarm["alarmSetpoint"],
                             'alarmType': alarm["alarmType"],
                             'alarmLevel': alarm.get('alarmLevel', None),
                             'uniqueAlarmId': self.makeUniqueAlarmId(item['assetId'], item['deviceId'], item['pointId'], alarm['alarmId']),
                             'active': alarm.get("active"),
                             'timestamp': alarm.get("timestamp")}

                    retVal.append(thingToAdd)

            return retVal

        except Exception as ex:
            print("Error in GetAlarmsForAsset: " + str(ex))


    # private function
    def makeUniqueAlarmId(self, assetId, deviceId, pointId, alarmId):
        try:
            # retVal = bytearray()
            # retVal.append(assetId)
            # retVal.append(deviceId)
            # retVal.append(pointId)
            # retVal.append(alarmId)
            #
            # final = binascii.hexlify(retVal)

            retVal = ""
            retVal += assetId.to_bytes(1, 'big').hex()
            retVal += deviceId.to_bytes(1, 'big').hex()
            retVal += pointId.to_bytes(1, 'big').hex()
            retVal += alarmId.to_bytes(1, 'big').hex()
            return retVal
        except Exception as ex:
            print("Error in makeUniqueAlarmId")


    def getActiveAlarmsForCust(self, results, custId, assetId, assetType, assetName):
        try:
            for item in self.collection.find({"custId": custId, "assetId": assetId}):
                alarmList = item.get("alarms")
                if alarmList is not None:
                    for alarm in alarmList:
                        if alarm.get("active") == True:
                            alarmToAdd = {"pointName": assetType + "." + assetName + "." + item["deviceName"] + "." + item["pointName"],
                                          "setpoint": alarm["alarmSetpoint"],
                                          "currVal": item["currVal"],
                                          "assetId": item.get("assetId"),
                                          "deviceId": item.get("deviceId"),
                                          "pointId": item.get("pointId"),
                                          "alarmId": alarm.get("alarmId"),
                                          "alarmName": alarm.get("alarmName"),
                                          "alarmType": alarm.get("alarmType"),
                                          "alarmLevel": alarm.get("alarmLevel", 3),
                                          'timestamp': alarm.get("timestamp"),
                                          "uniqueAlarmId": self.makeUniqueAlarmId(item.get("assetId"), item.get("deviceId"), item.get("pointId"), alarm.get("alarmId"))}

                            results.append(alarmToAdd)

            return results

        except Exception as ex:
            print("Error in getActiveAlarmsForCust: " + str(ex))


    def add_alarm_to_asset(self, custId, assetId, deviceId, pointId, alarmName, alarmText, alarmSetpoint, alarmType, alarmLevel):
        try:
            # TODO: Add alarmLevel to below queries

            # first calculate the id for the alarm
            filter = {"custId": custId, "assetId": assetId, "deviceId": deviceId, "pointId": pointId}
            project = {"alarmCount": 1}
            alarmCount = self.collection.find_one(filter, project)

            # Handle case where a point does not have an alarm yet
            newAlarmId = alarmCount.get("alarmCount")
            if newAlarmId is None:
                newAlarmId = 0

            update = {"$push": {"alarms": {"alarmId": newAlarmId, "alarmName": alarmName, "alarmText": alarmText, "alarmSetpoint": alarmSetpoint, "alarmType": alarmType, "alarmLevel": alarmLevel, "active": False, "timestamp": datetime.datetime.now()}},
                      "$inc": {"alarmCount": 1}}

            self.collection.update_one(filter, update)
            return 1
        except Exception as ex:
            print("Error in add_alarm_to_asset: " + str(ex))
            return 0


    def update_alarm_in_asset(self, custId, assetId, deviceId, pointId, alarmId, alarmName, alarmText, alarmSetpoint, alarmType, alarmLevel):
        try:
            # TODO: Add alarmLevel to below query

            filter = {"custId": custId, "assetId": assetId, "deviceId": deviceId, "pointId": pointId, "alarms": {"$elemMatch": {"alarmId": alarmId}} }
            update = {"$set": {"alarms.$": {"alarmId": alarmId, "alarmName": alarmName, "alarmSetpoint": alarmSetpoint, "alarmText": alarmText, "alarmType": alarmType, "alarmLevel": alarmLevel}}}

            self.collection.update_one(filter, update)
            return 1
        except Exception as ex:
            print("Error in update_alarm_in_asset: " + str(ex))
            return 0


    def delete_alarm_in_asset(self, custId, assetId, deviceId, pointId, alarmId):
        try:
            filter = {"custId": custId, "assetId": assetId, "deviceId": deviceId, "pointId": pointId}
            update = {"$pull": {"alarms": {"alarmId": alarmId}},
                      "$inc": {"alarmCount": -1}}
            self.collection.update(filter, update)
            return 1
        except Exception as ex:
            print("Error in delete_alarm_in_asset: " + str(ex))
            return 0