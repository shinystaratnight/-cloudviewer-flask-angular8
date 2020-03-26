# using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import enum


class SendEmail:
    class EmailTypes(enum.Enum):
        accountUnderReview = 1
        accountApproved = 2
        deliveryReport = 3
        alarm = 4
        PasswordReset = 5

    def sendStandardEmailMessage(self, emailAddress, subject, body):
        try:
            msgToSend = {
                "from": {
                    "email": "elimsnotify@economypolymers.com",
                    "name": "ELIMS - Economy Polymers"
                },
                "personalizations": [
                    {
                        "to": emailAddress,
                        "dynamic_template_data":
                            {
                                "Subject": subject,
                                "PreHeader": subject,
                                "body": body
                            }
                    }
                ],
                "template_id": "d-94777b141c9c4800b55452642b1a2c05"
            }

            # Interface to SendGrid
            sg = SendGridAPIClient('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')
            response = sg.send(msgToSend)
            return response
        except Exception as ex:
            self.logger.error('sendEmail.sendStandardEmailMessage: ' + str(ex))

    def sendSingleEmail(self, emailType, emailAddress, data=None):

        arrEmailAddress = []
        item = {"email": emailAddress}
        arrEmailAddress.append(item)

        try:
            if emailType == self.EmailTypes.accountUnderReview:
                response = self.sendStandardEmailMessage(arrEmailAddress, 'Your ELIMS account is under review for approval', 'We will let you know once your account have been approved.')

            elif emailType == self.EmailTypes.accountApproved:
                response = self.sendStandardEmailMessage(arrEmailAddress, 'Your ELIMS account has been approved', 'Your ELIMS account has been approved. please go to https://otr.elims.com to sign in.')

            elif emailType == self.EmailTypes.PasswordReset:
                response = self.sendStandardEmailMessage(arrEmailAddress, 'Your ELIMS account password reset',
                                              'This is your ELIMS password reset email.  Please go to https://otr.elims.com/sessions/reset/' + data + ' to complete the reset.')

            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(e.message)
