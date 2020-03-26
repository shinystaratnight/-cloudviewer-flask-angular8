from database import Session

from database import TankRTModel
from shared.enums import TankStatus


class SvcTankRT():

    Tanks=[]
    myLogger = None
    commChannelID = None

    def __init__(self, logger):
        self.myLogger = logger

    def getTanks(self, commChannelID):
        self.commChannelID = commChannelID
        self.Tanks = []
        self.Tanks = Session.query(TankRTModel).filter(TankRTModel.commChannelID == commChannelID).all()
        if self.Tanks is None:
            self.myLogger.info("Warning - There are no tanks configured for commchannelID:" + commChannelID)

        for tank in self.Tanks:
            self.myLogger.info('Adding tank:' + tank.name + 'to tankDBService')

            # Reinitialize tank
            tank.status = TankStatus.NotStarted.name

    def saveTankToDB(self):
        Session.commit()
        self.myLogger.debug('Saved tanksRT to DB')


    def fetchDataForTanks(self):
        tanks = Session.query(TankRTModel).filter(TankRTModel.commChannelID == self.commChannelID)
        return tanks

