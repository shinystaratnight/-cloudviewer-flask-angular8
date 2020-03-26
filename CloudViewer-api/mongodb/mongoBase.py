import pymongo
import ssl
import pprint
import json
from flask import jsonify
import datetime


class MongoBase:
    def __init__(self):
        self.client = pymongo.MongoClient(
            "mongodb+srv://Elims:Maggie123@mongocluster0-yiogz.mongodb.net/test?retryWrites=true&w=majority", ssl=True,
            ssl_cert_reqs=ssl.CERT_NONE)

        self.db = None
        self.collection = None