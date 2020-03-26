from database import Session

from database import DeviceAddressesModel


class SvcDeviceAddresses:

    def __init__(self, logger):
        self.logger = logger


    def getAddresses(self):
        retVal = []
        addresses = Session.query(DeviceAddressesModel).all()
        for address in addresses:
            retVal.append(address.address)
        # Session.remove()
        return retVal

    # def saveAddress(self):

    def updateAddresses(self, addressList):
        try:
            dbAddresses = Session.query(DeviceAddressesModel).all()
            # First compare addresses in database with those in provided address list
            for dbAddress in dbAddresses:
                found = False
                for address in addressList:
                    if dbAddress.address == address.address:
                        found = True
                        break

                if not found:
                    # this means remove it because it is in the DB not reported by the scanner
                    Session.delete(dbAddress)
                    Session.commit()

            # Second compare addresses in address list with those in database
            for address in addressList:
                found = False
                for dbAddress in dbAddresses:
                    if address.address == dbAddress.address:
                        found = True
                        break

                if not found:
                    # this means add it because it is in the address list but not the scanner
                    newAddress = DeviceAddressesModel()
                    newAddress.address = str(address.address)
                    Session.add(newAddress)
                    Session.commit()

            # Session.remove()
        except Exception as err:
            self.logger.error(str(err))

    # def checkIfJobStarted(self):
    #     job = Session.query(JobsModel).first()
    #     if job is None:
    #         self.logger.Error('svcJobs cannot find a job')
    #         return False
    #     else:
    #         if job.status == "Running":
    #             return True
    #         else:
    #             return False