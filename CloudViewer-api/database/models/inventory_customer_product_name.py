from database.db import *

class InventoryCustomerProductNameModel(db.Model):
    __tablename__ = 'Inventory_CustomerProductName'

    Id = db.Column(db.Integer, primary_key=True)
    ProductID = db.Column(db.ForeignKey('Inventory_Products.id'))
    CustomerID = db.Column(db.ForeignKey('CUSTOMERS.customerID'))
    Description = db.Column(db.Unicode)
    ElimsAdded = db.Column(db.Integer)

    @classmethod
    def find_by_id(cls, icpn_id):
        return cls.query.filter_by(Id=icpn_id).first()
