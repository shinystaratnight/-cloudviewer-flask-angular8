from database import db

class InventoryProductModel(db.Model):
    __tablename__ = 'Inventory_Products'

    id = db.Column(db.Integer, primary_key=True)
    Description = db.Column(db.Unicode)
    Conversion = db.Column(db.Float(53))
    ProductLineID = db.Column(db.ForeignKey('Inventory_ProductLines.id'))
    InventoryID = db.Column(db.Unicode(50))
    ProductClass = db.Column(db.Unicode(10))
    ProductNumber = db.Column(db.Integer)
    ProductNumDescription = db.Column(db.Unicode(50))

    Inventory_ProductLine = db.relationship('InventoryProductLine', primaryjoin='InventoryProduct.ProductLineID == InventoryProductLine.id', backref='inventory_products')
