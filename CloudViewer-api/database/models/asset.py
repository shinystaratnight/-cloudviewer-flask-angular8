from database.db import *
import datetime

class AssetModel(db.Model):
    __tablename__ = 'otr_assets'

    id = db.Column(db.Integer, primary_key=True)
    terminalSN = db.Column(db.Integer)
    satSN = db.Column(db.Unicode(20))
    tankID = db.Column(db.Integer, db.ForeignKey('TANKS.tankID'))
    name = db.Column(db.Unicode(20))
    leasedCustID = db.Column(db.Integer, db.ForeignKey('CUSTOMERS.customerID'))
    status = db.Column(db.Unicode(20))
    state = db.Column(db.Unicode(20))
    activeWellsite = db.Column(db.Integer)
    latitude = db.Column(db.Float(24))
    longitude = db.Column(db.Float(24))
    lastUpdate = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    assetType = db.Column(db.Unicode(20))
    ip = db.Column(db.Unicode(20))
    chemical = db.Column(db.Unicode(80))

    def __init__(self, terminalSN, satSN, tankID, name, leasedCustID, 
    status, state, activeWellsite, latitude, longitude, assetType, ip, chemical):
        self.terminalSN = terminalSN
        self.satSN = satSN
        self.tankID = tankID
        self.name = name
        self.leasedCustID = leasedCustID
        self.status = status
        self.state = state
        self.activeWellsite = activeWellsite
        self.latitude = latitude
        self.longitude = longitude
        self.lastUpdate = datetime.datetime.utcnow() #not sure if this is a good idea
        self.assetType = assetType
        self.ip = ip
        self.chemical = chemical

    def json(self):
        return {
            'id': self.id, 
            'terminal serial number': self.terminalSN, 
            'sat serial number': self.satSN, 
            'tank ID': self.tankID, 
            'name': self.name, 
            'leased customer ID': self.leasedCustID,
            'status': self.status,
            'state': self.state,
            'active well site': self.activeWellsite,
            'latitude': self.latitude,
            'longitude': self.longitude, 
            'lastUpdate': self.checkDate(self.lastUpdate), 
            'asset type': self.assetType,
            'chemical': self.chemical
        }

    @classmethod
    def getAllAssetInfo(cls):
        try:
            allAssets = cls.query.all()
            return allAssets
        except Exception as ex:
            print('Error in AssetModel-->getAllAssetInfo' + str(ex))

    def save_to_db(self):
        db.session.add(self) 
        db.session.commit()

    def delete_from_db(self): 
        db.session.delete(self)
        db.session.commit()

    def checkDate(self, date): 
        if(date):
            return date.isoformat()
        else:
            return ''

    @classmethod
    def find_by_id_and_type(cls, d_id, assetType):
        return cls.query.filter_by(id=d_id, assetType=assetType).first()


    @classmethod
    def find_by_id(cls, d_id):
        return cls.query.filter_by(id=d_id).first()


    @classmethod
    def check_asset_to_cust(cls, custId, assetId):
        asset = cls.query.filter_by(id=assetId, leasedCustID=custId).first()
        if asset is None:
            return False
        else:
            return True


    @classmethod
    def get_assets_by_custId_assetType(cls, customerID, assetType):
        return cls.query.filter_by(leasedCustID=customerID, assetType=assetType).all()

    @classmethod
    def get_assets_by_custId(cls, customerID):
        return cls.query.filter_by(leasedCustID=customerID).all()
