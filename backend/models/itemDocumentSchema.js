const mongoose = require("mongoose");
const ApprovedRequest = require('./requestSchema');

const itemDocumentSchema = new mongoose.Schema({
    "bill": String,
    "sanctionLetter": String,
    "inspectionReport": String,
    "purchaseOrder": String,
    "registerNo": String,
    "pageNo": String,
    "serialNo": String
}, { timestamps: true });

module.exports = mongoose.model("ItemDocument", itemDocumentSchema);