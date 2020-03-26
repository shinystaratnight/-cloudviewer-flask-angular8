from flask_restful import Resource
from database.models.customer import CustomerModel
from database.models.user import UserModel
from flask import request
from flask_jwt_extended import (jwt_required, get_jwt_claims)
import boto3, re, json


class Customer(Resource):

    # Add
    @jwt_required
    def post(self, name):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        epCustomerID = request.json.get('epCustomerID', None) 
        custRecDelivery = request.json.get('custRecDelivery', None)

        customer = CustomerModel.find_by_name(name)
        if customer:
            return {'message': "Customer'{}' already exists".format(name)}, 200

        #
        #
        # AWS KEYS
        # Boto3 session
        session = boto3.Session(
            aws_access_key_id='AKIAZZC2KR22FX5YWOZZ',
            aws_secret_access_key='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'
        )
        # region='us-east-2'
        
        # Create a iamClient
        # resource = session.resource('iam')
        client = session.client('iam')

        # username from company id
        username = name.lower();
        
        #regex clean up
        username = '__otrelims_company_FilesS3_' + re.sub(r"[^a-z]", "", username)

        # additional security, not needed
        # PermissionsBoundary='arn:aws:s3:::*',
        
        response = client.create_user(
            UserName=username,
            Tags=[
            {
                'Key': 'CompanyName',
                'Value': username
            },
            ]
        )

        # create access key
        AccessKeyResult = client.create_access_key(
            UserName=username
        )
        
        # AccessKeyResult['AccessKey']['AccessKeyID']
        # AccessKeyResult['AccessKey']['SecretAccessKey']
        
        # create policy
        policyDoc = {
            "Version":"2012-10-17",
            "Statement": [
              {
                "Sid": "AllowPUTandGETS3ActionsInCustomerFolder",
                "Effect": "Allow",
                "Action": [
                   "s3:PutObject",
                   "s3:GetObject"
                ],
                "Resource": ["arn:aws:s3:::otr.customerfiles/"+username+"/*"]
              },
              {
               "Sid": "AllowLISTwithPrefixInCustomerFolder",
               "Effect": "Allow",
               "Action": [
                   "s3:ListBucket"
               ],
               "Condition": {
                   "StringLike": {
                       "s3:prefix": [
                           username+"/"
                       ]
                   }
               },
               "Resource": [
                   "arn:aws:s3:::otr.customerfiles*"
                   ]
              }
            ]
        }
        
        PolicyResult = client.create_policy(
                PolicyDocument=json.dumps(policyDoc), 
                PolicyName=username 
        );
        
        # attach policy to user
        response = client.attach_user_policy(
            UserName=username,
            PolicyArn=PolicyResult['Policy']['Arn']
        )
        
        #
        #
        #
        
        new_customer = CustomerModel(name, epCustomerID, custRecDelivery
                                    , AccessKeyResult['AccessKey']['AccessKeyId']
                                    , AccessKeyResult['AccessKey']['SecretAccessKey'])
        
        try:
            new_customer.save_to_db()
        except:
            return {"message": "An error occurred saving customer"}, 500
        
        
        return new_customer.json (), 201

    @jwt_required
    def get(self, name):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403
        customer = CustomerModel.find_by_name(name)
        if customer:
            return customer.json()
        return {'message': 'customer not found'}, 200

    @jwt_required
    def delete(self, name): 
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        customer = CustomerModel.find_by_name(name)
        if customer is None: 
            return {'message':'customer not found'}, 200
        else:
            try: 
                customer.delete_from_db()
            except Exception as error:
                return {'message':'error deleting customer: {}'.format(error)}, 500
        
        return {'message':'customer {} deleted'.format(name)}, 200

    # Update
    @jwt_required
    def put(self, name):
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        customer = CustomerModel.find_by_name(name)
        if customer is None: 
            return {'message':'customer not found'}, 200
        else:
            customer.customerName = request.json.get('customerName', None)
            customer.epCustomerID = request.json.get('epCustomerID', None) 
            customer.custRecDelivery = request.json.get('custRecDelivery', None)

            try: 
                customer.save_to_db()
            except Exception as error:
                return {'message':'error updating customer: {}'.format(error)}, 500

        return customer.json() 


class CustomerList(Resource):

    @jwt_required
    def get(self): 
        claims = get_jwt_claims()

        userAccessLevel = claims['accessLevel']
        
        if not UserModel.is_admin(userAccessLevel):
            return {'message': 'access denied'}, 403

        return {'customers': list(map(lambda x: x.json(), CustomerModel.query.all()))} 
