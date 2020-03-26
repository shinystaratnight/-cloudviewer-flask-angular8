from database import db

class InventoryProductLineModel(db.Model):
    __tablename__ = 'Inventory_ProductLines'

    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.Unicode(50))