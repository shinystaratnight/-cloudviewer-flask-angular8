# from database.base import Base
from database import Session


from database import CommStatusModel
from shared.enums import Protocols


class SvcCommChannels:
    # def

    commConfig = None  # Storage location for database model


    def __init__(self, logger):
        self.myLogger = logger


    def getTankChannel(self):
        # Try to get OT first, if it does not work, then get SF, it it does not work, then report error
        self.getSFChannel()
        if self.commConfig is None:
            self.getOTChannel()
            if self.commConfig is None:
                self.getNTEChannel()
                if self.commConfig is None:
                    self.getSimChannel()
                    if self.commConfig is None:
                        self.getAmChannel()
                        if self.commConfig is None:
                            self.myLogger.error("There is no recognizable communication channel for tank sensors")


    def getAmChannel(self):
        self.commConfig = Session.query(CommStatusModel).filter(CommStatusModel.protocol == Protocols.Ametek.name).first()
        if self.commConfig is not None:
            self.myLogger.info(
                'Ametek commChannel Info - interval:' + str(self.commConfig.interval) + " timeout:" + str(
                    self.commConfig.timeout)
            )

    def getSimChannel(self):
        self.commConfig = Session.query(CommStatusModel).filter(CommStatusModel.protocol == Protocols.Sim.name).first()
        if self.commConfig is not None:
            self.myLogger.info(
                'Sim commChannel Info - interval:' + str(self.commConfig.interval) + " timeout:" + str(
                    self.commConfig.timeout) + " commPort:" + str(self.commConfig.name))

    def getSFChannel(self):
        self.commConfig = Session.query(CommStatusModel).filter(CommStatusModel.protocol == Protocols.SignalFire.name).first()
        if self.commConfig is not None:
            self.myLogger.info(
                'Signal Fire commChannel Info - interval:' + str(self.commConfig.interval) + " timeout:" + str(
                    self.commConfig.timeout) + " commPort:" + str(self.commConfig.name))


    def getOTChannel(self):
        self.commConfig = Session.query(CommStatusModel).filter(
            CommStatusModel.protocol == Protocols.OleumTech.name).first()
        if self.commConfig is not None:
            # self.myLogger.error("Error - There is no OleumTech communication channel")
            self.myLogger.info(
                'OleumTech commChannel Info - interval:' + str(self.commConfig.interval) + " timeout:" + str(
                    self.commConfig.timeout) + " commPort:" + str(self.commConfig.name))


    def getNTEChannel(self):
        self.commConfig = Session.query(CommStatusModel).filter(
            CommStatusModel.protocol == Protocols.NTE.name).first()
        if self.commConfig is not None:
            self.myLogger.info(
                'NET commChannel Info - interval:' + str(self.commConfig.interval) + ' timeout:' + str(
                    self.commConfig.timeout) + " commPort:" + str(self.commConfig.name))




    def updateCommStatus(self, commStatus):
         self.commConfig.status = commStatus.name
         self.commConfig.statusCode = commStatus.value
         Session.commit()
         self.myLogger.debug('Updated commStatus:' + str(commStatus))