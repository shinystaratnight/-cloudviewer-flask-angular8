import logging
import logging.handlers as handlers
from logging.handlers import TimedRotatingFileHandler
import datetime
from enum import Enum
import os


class LogLevels(Enum):
    error = 1
    info = 2
    debug = 3

class MyLogger:

    LogLevel = LogLevels.info
    logger = None


    def __init__(self, serviceName):
        try:
            self.logger = logging.getLogger(serviceName)
            self.logger.setLevel(logging.INFO)

            log_file_location = '/home/debian/logs/' + serviceName
            path_to_file = log_file_location + '/' + serviceName + '-log'

            # Make sure the directory exists for the service
            if not os.path.exists(log_file_location):
                try:
                    os.makedirs(log_file_location)
                except Exception as ex:
                    print('Error unable to make log file directory for: ' + serviceName)

            # Create file handler
            log_handler = logging.handlers.TimedRotatingFileHandler(path_to_file, when="midnight", interval=1,
                                                                    backupCount=10)

            # Add handler to logger
            self.logger.addHandler(log_handler)
        except Exception as ex:
            print(str(ex))


    def debug(self, msg):
        if self.LogLevel.value >= 3:
            try:
                msg_string = str(datetime.datetime.now()) + " Debug: " + str(msg)
                self.logger.debug(msg_string)
                print(msg_string)
            except Exception as ex:
                logging.error(str(ex))


    def info(self, msg):
        if self.LogLevel.value >= 2:
            try:
                msg_string = str(datetime.datetime.now()) + " Info: " + str(msg)
                self.logger.info(msg_string)
                print(msg_string)
            except Exception as ex:
                logging.error(str(ex))


    def error(self, msg):
        if self.LogLevel.value >= 1:
            try:
                msg_string = str(datetime.datetime.now()) + " Error: " + str(msg)
                self.logger.error(msg_string)
                print(str(msg_string))
            except Exception as ex:
                logging.error(str(ex))