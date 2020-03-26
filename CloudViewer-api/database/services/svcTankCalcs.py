from database import Session

from database import TankCalcsModel


class SvcTankCalcs():

    stageStartLevel = 0
    stageStartVolume = 0
    jobStartLevel = 0
    totalStartVolume = 0
    currentStageID = 0
    jobStarted = False
    tankID = 0


    def __init__(self, logger, tankID):
        self.myLogger = logger
        self.tankID = tankID


    def getCalcInfo(self):
        tank = Session.query(TankCalcsModel).filter(TankCalcsModel.tankID == self.tankID).first()
        if tank is None:
            self.createCalcInfo(self.tankID, 0, 0, 0, 0)
        else:
            self.stageStartLevel = tank.stageStartLevel
            self.stageStartVolume = tank.stageStartVolume
            self.jobStartLevel = tank.jobStartLevel
            self.currentStageID = tank.currentStageID
            self.jobStarted = tank.jobStarted
            self.myLogger.debug('Updated local params from DB')
        return tank


    def push_clearAll(self):
        tankCalcToUpdate = Session.query(TankCalcsModel).filter(TankCalcsModel.tankID == self.tankID).first()
        if tankCalcToUpdate is None:
            self.createCalcInfo(self.tankID, 0, 0, 0, 0, 0)
        else:
            tankCalcToUpdate.stageStartLevel = 0
            tankCalcToUpdate.jobStartLevelStartLevel = 0
            tankCalcToUpdate.currentStageID = 0
            tankCalcToUpdate.jobStarted = False
            Session.commit()

            self.stageStartLevel


    def push_jobStarted(self, currentLevel):
        tankCalcToUpdate = Session.query(TankCalcsModel).filter(TankCalcsModel.tankID == self.tankID).first()
        if tankCalcToUpdate is None:
            self.createCalcInfo(self.tankID, 0, 0, currentLevel, 0, 0)
        else:
            tankCalcToUpdate.jobStartLevel = currentLevel
            tankCalcToUpdate.jobStarted = True
            Session.commit()

            self.jobStartLevel = currentLevel
            self.jobStarted = True


    def push_stageStarted(self, currentLevel, stageID, currentVolume):
        tankCalcToUpdate = Session.query(TankCalcsModel).filter(TankCalcsModel.tankID == self.tankID).first()
        tankCalcToUpdate.stageStartLevel = currentLevel
        tankCalcToUpdate.stageStartVolume = currentVolume
        tankCalcToUpdate.currentStageID = stageID
        Session.commit()

        self.currentStageID = stageID
        self.stageStartLevel = currentLevel


    def createCalcInfo(self, tankID, stageLevel, totalLevel, currentStageID, jobStarted):
        # First make sure that it does not already exist
        reqNewCalc = Session.query(TankCalcsModel).filter(TankCalcsModel.tankID == tankID).first()
        if reqNewCalc is None:
            self.myLogger.info('Creating new tankCalc record in DB for tankID:' + str(tankID))
            self.stageStartLevel = stageLevel
            self.jobStartLevel = totalLevel
            self.currentStageID = currentStageID

            newCalc = TankCalcsModel()
            newCalc.stageLevel = stageLevel
            newCalc.jobStartLevel = totalLevel
            newCalc.currentStageID = currentStageID
            newCalc.tankID = tankID
            newCalc.jobStarted = jobStarted
            Session.add(newCalc)
            Session.commit()
            self.myLogger.info('svcTankCalcs.createCalcInfo --> created new CalcInfo for tankID:' + str(tankID))
        else:
            self.myLogger.info('SvcTankCalcs.createCalcInfo--> Error db record already available tankID:' + str(tankID))
