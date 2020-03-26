from database import Session
from database import JobsModel


class SvcJobs:

    def __init__(self, logger):
        self.logger = logger

    def checkIfJobStarted(self):
        job = Session.query(JobsModel).first()
        if job is None:
            self.logger.Error('svcJobs cannot find a job')
            return False
        else:
            if job.status == "Running":
                return True
            else:
                return False