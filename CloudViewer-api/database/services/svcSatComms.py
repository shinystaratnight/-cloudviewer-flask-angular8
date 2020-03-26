from database import Session
from database import SendQueueModel
from database import CommStatusModel
from database.models.appInfo import AppInfoModel
from database import JobsModel
from database import SatStatusModel
from database import WellInfoModel
from shared.enums import Protocols, JobMessages, SendQueueMsgStatus, SatSignalQuality, WellStatus, JobStatus
import datetime



class SatCommDataService:

    # queue = None
    myLogger = None

    commChannel = None

    def __init__(self, logger):
        self.myLogger = logger


    def getNextMsg(self):
        nextMsg = Session.query(SendQueueModel).filter(SendQueueModel.msgStatusCode == SendQueueMsgStatus.NotSent.value).order_by(SendQueueModel.priority.asc()).first()

        self.myLogger.info('Trying to find new message to send')

        # Check How many times the message has been attempted
        if nextMsg is not None:
            if nextMsg.attempts > 2:
                # Mark the message with error and then get the next message
                nextMsg.msgStatus = SendQueueMsgStatus.Error.name
                nextMsg.msgStatusCode = SendQueueMsgStatus.Error.value
                Session.commit()

                nextMsg = Session.query(SendQueueModel).filter(SendQueueModel.msgStatusCode == SendQueueMsgStatus.NotSent.value).order_by(SendQueueModel.priority.asc()).first()
                self.myLogger.info('Marking SendQueue message as error becuase resend has occured 3 times')

        return nextMsg




    def MarkSendQueueMsgComplete(self, id, timeToTransmit):
        try:
            deleteMsg = True

            self.myLogger.info('removing message from queue')
            itemToModify = Session.query(SendQueueModel).filter(SendQueueModel.id == id).first()
            if itemToModify is None:
                self.myLogger.info('Error in removeFromQueue, ID could not be found')
            else:
                if deleteMsg:
                    Session.delete(itemToModify)
                else:
                    itemToModify.attempts += 1;
                    itemToModify.timestampSent = datetime.datetime.utcnow()
                    itemToModify.timeToTransmit += timeToTransmit
                    itemToModify.msgStatus = SendQueueMsgStatus.Sent.name
                    itemToModify.msgStatusCode = SendQueueMsgStatus.Sent.value

                # Session.delete(itemToModify)
                Session.commit()
        except Exception as ex:
            self.myLogger.error(str('Error in MarkSendQueueMsgComplete: ' + ex))


    def updateSendQueueMsgStatus(self, id, OTAStatus, msgStatus):
        itemToModify = Session.query(SendQueueModel).filter(SendQueueModel.id == id).first()
        if itemToModify is not None:
            if OTAStatus is not None:
                itemToModify.OTAMsgStatus = OTAStatus.name
                itemToModify.OTAMsgStatusCode = OTAStatus.value
            if msgStatus is not None:
                itemToModify.msgStatus = msgStatus.name
                itemToModify.msgStatusCode = msgStatus.value
            Session.commit()


    def getCommChannel(self):
        self.commChannel = Session.query(CommStatusModel).filter(CommStatusModel.protocol == Protocols.ISatData.name).first()
        if self.commChannel is None:
            self.myLogger.error("Unable to find ISatData comm channel in database")


    def updateCommStatus(self, commStatus):
        if self.commChannel.status != commStatus.name:
            self.commChannel.status = commStatus.name
            self.commChannel.statusCode = commStatus.value
            Session.commit()
            self.myLogger.info('Updated CommStatus: ' + commStatus.name)


    def saveTermID(self, termID):
        appInfo = Session.query(AppInfoModel).first()
        appInfo.terminalID = termID
        Session.commit()


    def getTerminalID(self):
        appInfo = Session.query(AppInfoModel).first()
        return appInfo.terminalID


    def updateJobInfo(self, jobNumber, customer, currentWell, fracCrew, fieldTech, location, status):
        jobInfo = Session.query(JobsModel).first()
        jobInfo.jobNumber = jobNumber
        jobInfo.customer = customer
        jobInfo.currentWell = currentWell
        jobInfo.fracCrew = fracCrew
        jobInfo.fieldTech = fieldTech
        jobInfo.location = location
        jobInfo.status = status
        jobInfo.message = JobMessages.JobIDValid.name
        jobInfo.messageCode = JobMessages.JobIDValid.value

        # also add a well
        newWell = WellInfoModel()
        newWell.wellName = currentWell
        newWell.status = WellStatus.Standby.value
        newWell.jobID = jobNumber
        newWell.currentStage = 0
        Session.add(newWell)

        Session.commit()

    def updateJobMessage(self, JobMessage):
        jobInfo = Session.query(JobsModel).first()
        jobInfo.message = JobMessage.name
        jobInfo.messageCode = JobMessage.value
        Session.commit()

    def updateGPS(self, lat, long):
        jobInfo = Session.query(JobsModel).first()
        needToSave = False

        if lat is not None and long is not None:

            deltaLat = abs(jobInfo.gpsLat - lat)
            deltaLong = abs(jobInfo.gpsLong - long)

            if deltaLat > .0001:
                jobInfo.gpsLat = lat
                needToSave = True
            if deltaLong > .0001:
                jobInfo.gpsLong = long
                needToSave = True

            if needToSave:
                Session.commit()
                self.myLogger.info('Updated GPS coordinates in Jobs')


    def clearMessageData(self):
        # clear JobMessage info
        jobInfo = Session.query(JobsModel).first()
        jobInfo.message = JobMessages.Idle.name
        jobInfo.messageCode = JobMessages.Idle.value
        Session.commit()

        # Clear sendQueue message info
        itemToClear = Session.query(SendQueueModel).filter(SendQueueModel.msgStatusCode == SendQueueMsgStatus.InProgress.value).first()
        if itemToClear is not None:
            itemToClear.msgStatusCode = SendQueueMsgStatus.NotSent.value
            itemToClear.msgStatus = SendQueueMsgStatus.NotSent.name
            itemToClear.attempts += 1
            Session.commit()


    def updateSatStatus(self, signalQuality, signalLevel, isRegistered, lat, long, overallStatus):
        try:
            #Convert quality to enum
            signalQualityEnum = SatSignalQuality(signalQuality)

            satStatus = Session.query(SatStatusModel).first()
            satStatus.signalQuality = signalQualityEnum.name
            satStatus.signalQualityCode = signalQualityEnum.value
            satStatus.signalLevel = signalLevel
            satStatus.isRegistered = isRegistered
            satStatus.lat = lat
            satStatus.long = long
            satStatus.overallStatus = overallStatus.name
            satStatus.overallStatusCode = overallStatus.value
            Session.commit()

        except Exception as ex:
            self.myLogger.error('updateSatStatus: ' + str(ex))


    def markSendQueueMessageError(self, msg):
        self.myLogger.error('Marking sendQueue item as error because message could not be encoded')
        errorMsg = Session.query(SendQueueModel).filter(SendQueueModel.id == msg.id).first()
        if errorMsg is None:
            return

        errorMsg.msgStatus = SendQueueMsgStatus.Error.name
        errorMsg.msgStatusCode = SendQueueMsgStatus.Error.value
        Session.commit()
        # Session.remove()

    def markJobComplete(self):
        jobInfo = Session.query(JobsModel).first()
        jobInfo.status = JobStatus.Completed.name
        Session.commit()

