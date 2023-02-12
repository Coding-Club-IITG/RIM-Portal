const mongoose= require("mongoose");

const itemSchema= new mongoose.Schema({
    "name": String,
    "category": String,
    "ownedBy": String,
    "heldBy": String,
    "quantity": Number,
    "purchasedOn": String,
    "bill": String,
    "sanctionLetter": String,
    "purchaseOrder": String,
    "status": String,
    "remarks": String
});

module.exports=mongoose.model("Item", itemSchema);