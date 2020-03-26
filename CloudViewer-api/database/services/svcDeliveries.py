from database import Session

from database import DeliveriesModel

class SvcDeliveries:

    myLogger = None
    tankID = 0
    lastVolume = 0

    def __init__(self, logger, tankID):
        self.myLogger = logger
        self.tankID = tankID
        self.myLogger.info('Delivery Service for tankID:' + str(tankID) + ' initialized')

    def getDeliveredForTank(self):
        deliveredAmount = 0
        deliveries = Session.query(DeliveriesModel).filter(DeliveriesModel.tankID == self.tankID)
        if deliveries is [] or deliveries is None:
            return deliveredAmount

        for delivery in deliveries:
            deliveredAmount = deliveredAmount + delivery.amount

        return deliveredAmount

    def manageDeliveries(self, volume, level):
        # Set start amount for new deliveries
        # Calculate differential of existing active deliveries
        isDelivering = False

        # if volume != self.lastVolume:
        ad = Session.query(DeliveriesModel).filter(DeliveriesModel.tankID == self.tankID, DeliveriesModel.status == 'active').first()
        if ad is None:
            self.myLogger.debug('No active deliveries for tankID:' + str(self.tankID))
        else:
            isDelivering = True
            # if ad.startAmount == 0 or ad.startAmount is None:
            #     ad.startAmount = volume
            #     ad.amount = volume - self.lastVolume
            #     self.myLogger.info('Set the start amount for deliveryID:' + str(ad.id) + ' to ' + str(volume) + ' gal')
            # else:
            ad.amount = volume - ad.startVolume
            ad.lastVolume = volume
            ad.lastLevel = level

            Session.commit()
            self.myLogger.info('Updated Delivery for tankID:' +str(self.tankID) + ' to:' + str(ad.amount) + ' gal')
            self.lastVolume = volume

        self.lastVolume = volume
        return isDelivering

    def completeDelivery(self, tankID):
        delivery = Session.query(DeliveriesModel).filter(DeliveriesModel.tankID == tankID,
                                                         DeliveriesModel.status.like('active')).first()
        if delivery is None:
            return 'Unable to complete delivery, there is no active delivery found for the provided tankID'

        delivery.status = 'complete'
        delivery.timestampEnd = datetime.datetime.now()