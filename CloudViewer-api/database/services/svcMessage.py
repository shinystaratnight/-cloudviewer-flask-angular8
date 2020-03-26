from database import Session

from database import MessagingModel
from shared.enums import Message


class SvcMessage:

    def checkForDaRestartMessage(self):
        try:
            doRestart = False
            msgs = Session.query(MessagingModel).filter(MessagingModel.messageID == Message.DaRestart.value).all()
            if msgs is not None:
                for item in msgs:
                    if item.messageID == Message.DaRestart.value:
                        doRestart = True
                        Session.delete(item)

                Session.commit()

            if doRestart:
                return True

            return False
        except Exception as err:
            Session.rollback()


    def createDaRestartMessage(self):
        newMessage = MessagingModel()
        newMessage.fromFront = True
        newMessage.messageID = Message.DaRestart.value
        Session.add(newMessage)
        Session.commit()
        Session.remove()


    def checkForSatCommRestartMessage(self):
        try:
            msgs = Session.query(MessagingModel).filter(MessagingModel.messageID == Message.SatRestart.value).first()
            if msgs is None:
                return False
            else:
                Session.delete(msgs)
                Session.commit()
                print('Restart Message received')
                return True
        except Exception as error:
            self.myLogger.error(error)


    def createSatCommRestartMessage(self):
        newMesssage = MessagingModel()
        newMesssage.fromFront = True
        newMesssage.messageID = Message.SatRestart.value
        Session.add(newMesssage)
        Session.commit()
