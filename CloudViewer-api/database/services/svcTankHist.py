from database import Session
import datetime

from database import TanksHistModel


class SvcTankHist:

    def addRecord(self, tankID, level, percent, volume,rssi,voltage,weight,temperature, status):
        newRecord = TanksHistModel()
        newRecord.tankID = tankID
        newRecord.level = level
        newRecord.percent = percent
        newRecord.volume = volume
        newRecord.rssi = rssi
        newRecord.voltage = voltage
        newRecord.weight = weight
        newRecord.temperature = temperature
        newRecord.timestamp = datetime.datetime.utcnow()
        newRecord.status = status
        Session.add(newRecord)
        Session.commit()