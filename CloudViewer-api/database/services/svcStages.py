from database import Session

from database import StagesModel
# from database.models.wellInfo import WellInfoModel
from shared.enums import StageStatus

class SvcStages():

    # Hold values for last known stage info
    lastStageID = 0
    LastStageWellID = 0
    isActiveStage = False

    def isActiveStage(self):
        activeStage = Session.query(StagesModel).filter(StagesModel.status.like(StageStatus.Running.name)).first()
        if activeStage is None:
            return False
        else:
            return True

    def getActiveStageID(self):
        activeStage = Session.query(StagesModel).filter(StagesModel.status.like(StageStatus.Running.name)).first()
        if activeStage is None:
            return 0
        else:
            return activeStage.id

    # def addStageLogs(self):
    #     # Get a list of all the tanks
    #     tanks = Session.query(TankRTModel).all()
    #     for tank in tanks:
    #         newStageTank = StageTankModel()
    #         newStageTank.tankID = tank.id
    #         newStageTank.tankNumber = tank.tankNumber
    #         newStageTank.galConsumed = tank.stageAmount
    #         newStageTank.stageID = self.lastStageID
    #         Session.add(newStageTank)
    #
    #         # now update tank Info
    #         tank.stageAmount = 0
    #         tank.stageConsummed = 0
    #         Session.commit()



    # def UpdateWellStats(self):
    #
    #
    # def UpdateTankStats(self):


    # NEEDS to be moved to tanks Calcs and add currentStage to models.tankcalcs
    # def checkIfStageChanged(self):
    #     activeStage = Session.query(StagesModel).filter(StagesModel.status.like(StageStatus.Running.name)).first()
    #     if activeStage is None:
    #         print('There is no active stage at the moment')
    #         self.lastStageID = 0
    #         self.isActiveStage = False
    #         return False
    #     else:
    #         if activeStage.id is self.lastStageID:
    #             print('The stage has not changed. Still ID: ' + str(self.lastStageID))
    #             return False
    #         else:
    #             print('A new stage has started, ID: ' + str(activeStage.id))
    #
    #             # self.addStageLogs()
    #             # self.UpdateWellStats()
    #             # self.UpdateTankStats()
    #
    #             self.lastStageID = activeStage.id
    #             return True
    #
    #             # add message to satellite queue - THIS is being completed in the API right now


