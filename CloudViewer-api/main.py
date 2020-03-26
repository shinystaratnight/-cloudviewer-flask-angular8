import os
from flask import Flask, render_template
from flask_restful import Api
from flask_jwt_extended import (JWTManager)
from flask_cors import CORS
from database.db import *

from database.models.user import UserModel
from database.models.customer import CustomerModel
from database.models.revoked_token import RevokedTokenModel

from resources.root import Root

from resources.elims_admin.userManagement.user_validate import UserValidate

from resources.user_access.login import Login
from resources.user_access.logout import UserLogout

from resources.user_access.userAllDistricts import UserAllDistricts
from resources.user_access.userAddDistrict import UserAddDistrict
from resources.user_access.userRemoveDistrict import UserRemoveDistrict

from resources.user_profile.change_password import ChangePassword
from resources.user_profile.user_profile import UserProfile
from resources.user_profile.allAvailableDistricts import AllAvailableDistricts
from resources.user_profile.selectedDistricts import SelectedDistricts
from resources.user_profile.addDistrict import AddDistrict
from resources.user_profile.removeDistrict import RemoveDistrict

from resources.districts.district import District, DistrictList
from resources.districts.district_customer import DistrictsCustomer

from resources.manage.assets.manage_asset import ManageAssetList
from resources.manage.assets.asset_detail import AssetDetail
from resources.manage.wellsite.well_site import WellSite
from resources.manage.wellsite.well_site_list import WellSiteListModel
from resources.manage.wellsite.well_site_states import WellSiteStates
from resources.manage.well import Well

# from resources.manage.facilities.manage_facility import ManageFacility, ManageFacilityList
# from resources.manage.wellsite import well_site, well_site_list
# from resources.manage.assets.well_site_list import WellSiteListModel

from resources.manage.facilities.manage_facility import ManageFacility, ManageFacilityList

# Alarms
from resources.manage.assets.alarmConfig.getAlarmsForAsset import GetAlarmsForAsset
from resources.manage.assets.alarmConfig.addAlarmForAsset import AddAlarmForAsset
from resources.manage.assets.alarmConfig.editAlarm import EditAlarm
from resources.manage.assets.alarmConfig.deleteAlarm import DeleteAlarm
from resources.manage.assets.alarmConfig.getAlarmTypes import GetAlarmTypes
from resources.manage.assets.alarmConfig.getPointsForAsset import GetPointsForAsset
from resources.manage.assets.alarmConfig.getActiveAlarmsForCust import GetActiveAlarmsForCust
from resources.manage.assets.alarmConfig.getAlarmLevels import GetAlarmLevels

from resources.elims_admin.user_role import UserRoleList
from resources.user_access.userRegistrationReq import UserRegistrationRequest, UserRegistrationRequestList
from resources.user_access.userAccountReset import UserAccountReset
from resources.elims_admin.userManagement.user_approval import UserApproval
from resources.elims_admin.user import UserList

from resources.elims_admin.tank import Tank
from resources.elims_admin.customer import Customer, CustomerList
from resources.elims_admin.userManagement.customerDistricts import GetCustomerDistricts
from resources.elims_admin.assetManagement.getAssetInfo import GetAllAssets
from resources.elims_admin.assetManagement.updateAsset import UpdateAsset
from resources.elims_admin.assetManagement.addAsset import AddAsset

from resources.analytics.trending.getHistForPoint import GetHistForPoint
from resources.analytics.trending.getPointsSimple import GetPointsSimple
from resources.analytics.trending.getRTForAsset import GetRTForAsset

from resources.elims_admin.devices.updateDeviceName import UpdateDeviceName
from resources.elims_admin.devices.deleteDevice import DeleteDevice

from resources.dashboards.main.mainDashboard import MainDashboard

import logging

application = Flask(__name__)
# logging.basicConfig(level=logging.INFO)
application.debug = True

# Setup Logging
fileLocation = 'api.log'
logging.basicConfig(filename=fileLocation, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(module)s - %(message)s')
logging.getLogger(__name__)
logging.info('api logger initialized')

application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Test database
# application.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mssql+pymssql://elims1:Maggie123@test.cph1ok3q9izr.us-east-2.rds.amazonaws.com:1433/elims2')

# Production database
application.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mssql+pymssql://elims1:Maggie123@elims.cph1ok3q9izr.us-east-2.rds.amazonaws.com:1433/elims2')

application.config['JWT_SECRET_KEY'] = 'david'
application.config['JWT_BLACKLIST_ENABLED'] = True
application.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
application.secret_key = 'david'
api = Api(application)

# Handle CORS
CORS(application, supports_credentials=True)


# *********************** Setup 404 handler *****************************
@application.errorhandler(404)
# Built in function which takes error as parameter
def not_found(e):
    return render_template("404.html") # defining function

# *********************** Application Events *****************************
@application.route("/")
def index():
    print(application.root_path)
    return render_template('index.html')


# Setup the JWT token
jwt = JWTManager(application)


@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    user = UserModel.find_by_username(identity)
    customer = CustomerModel.find_by_id(user.companyID)
    return {
        'hello': identity,
        'accessLevel': user.accessLevel,
        'customerID': user.companyID,
        'userID': user.id,
        'AWS_ID': customer.cAWSKey,
        'AWS_SECRET': customer.cAWSSecret
    }


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return RevokedTokenModel.is_jti_blacklisted(jti)


# root
api.add_resource(Root, '/')

# user access
api.add_resource(Login, '/login')
api.add_resource(UserRegistrationRequest, '/register')
api.add_resource(UserLogout, '/logout')
api.add_resource(UserAccountReset, '/AccountReset')
api.add_resource(UserAllDistricts, '/userAccess/districtsForUser/<string:username>')
api.add_resource(UserAddDistrict, '/userAccess/addDistrict/<string:name>')
api.add_resource(UserRemoveDistrict, '/userAccess/removeDistrict/<string:id>')

# not sure what these are for
# api.add_resource(Security, '/auth')
# api.add_resource(UserRole, '/role/<string:name>')
# api.add_resource(User, '/user/<string:username>')

# user profile
api.add_resource(ChangePassword, '/myprofile/changepassword')
api.add_resource(UserProfile, '/myprofile/profile')  # handle both getting and updating profile
api.add_resource(AllAvailableDistricts, '/myprofile/allAvailableDistricts')
api.add_resource(SelectedDistricts, '/myprofile/showDistricts')
api.add_resource(AddDistrict, '/myprofile/addDistrict/<int:id>')
api.add_resource(RemoveDistrict, '/myprofile/removeDistrict/<int:id>')

# elims admin
# api.add_resource(Profile, '/userupdateprofile')
# api.add_resource(UserValidate, '/validate/<string:username>')
api.add_resource(District, '/district/<string:name>')
api.add_resource(Customer, '/company/<string:name>')
api.add_resource(UserApproval, '/elimsadmin/approveuser')  # Convert user registration to user account
api.add_resource(UserRoleList, '/roles')
api.add_resource(UserRegistrationRequestList, '/requests')
api.add_resource(UserList, '/getlistallusers')
api.add_resource(DistrictList, '/districts')
api.add_resource(CustomerList, '/companies')
# api.add_resource(ManageAsset, '/asset/<string:id>')
api.add_resource(Tank, '/tank/<string:id>')

# elims admin ********************************************
api.add_resource(GetCustomerDistricts, '/elims_admin/users/getdistrictsforcust/<string:custId>')
api.add_resource(GetAllAssets, '/elims_admin/assets/getallassets')
api.add_resource(UpdateAsset, '/elims_admin/assets/updateasset')
api.add_resource(AddAsset, '/elims_admin/assets/addasset')

# manage assets ********************************************
api.add_resource(ManageAssetList, '/manage/assets')

# --- Asset Details *****************************************
api.add_resource(AssetDetail, '/manage/assetdetail/<string:id>')

# --- Alarms ************************************************
api.add_resource(GetAlarmsForAsset, '/manage/assets/alarms/getalarmlistforasset')
api.add_resource(AddAlarmForAsset, '/manage/assets/alarms/addalarm')
api.add_resource(EditAlarm, '/manage/assets/alarms/editalarm')
api.add_resource(DeleteAlarm, '/manage/assets/alarms/deletealarm')
api.add_resource(GetAlarmTypes, '/manage/assets/alarms/getalarmtypes')
api.add_resource(GetPointsForAsset, '/manage/assets/alarms/getpointsforasset')
api.add_resource(GetActiveAlarmsForCust, '/alarms/getactivealarms')
api.add_resource(GetAlarmLevels, '/alarms/getalarmlevels')

# -- manage facilities **************************************
api.add_resource(ManageFacilityList, '/manage/facilities')
api.add_resource(ManageFacility, '/manage/facilitydetail/<string:id>')

# manage wellsites
api.add_resource(WellSiteListModel, '/manage/wellsitelist')
api.add_resource(WellSiteStates, '/job/getwellsitestates')
api.add_resource(DistrictsCustomer, '/districts/customerdistricts')
api.add_resource(WellSite, '/job/<string:id>')

# api.add_resource(WellSiteListModel, '/jobs')
# api.ad
# api.add_resource(TankList, '/tanks')

# manage wells
api.add_resource(Well, '/well/<string:id>')
# api.add_resource(WellList, '/wells')


# Dashboards *************************
api.add_resource(MainDashboard, '/dashboards/main')

# Analytics **************************
# --- Trending ***********************
# api.add_resource(getPoints, '/analytics/getpoints')
api.add_resource(GetPointsSimple, '/analytics/getpointssimple')
api.add_resource(GetHistForPoint, '/analytics/gethistforpoint')

api.add_resource(GetRTForAsset, '/assets/getrtforasset')

api.add_resource(UpdateDeviceName, '/devices/updatedevicename')
api.add_resource(DeleteDevice, '/devices/deletedevice')

# *************************** Sandbox ***************************
# api.add_resource(MongoAsset, '/sandbox/addmasset')

db.init_app(application)

with application.app_context():  # huh, interesting. Script to create tables
    db.create_all()

# Only for local development
if __name__ == '__main__':
    # For AWS
    application.run(host='0.0.0.0', debug=True)

# For local
# application.run(port=5000, debug=True, host='0.0.0.0')
