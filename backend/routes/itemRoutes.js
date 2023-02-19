require('dotenv').config()
const express= require("express");
const jwt = require('jsonwebtoken');
const itemRouter = express.Router();
const {download, addItem, listAllItems} = require("../controllers/item.js");
const authenticateToken = require('../middleware/authToken.js');

//With authentication token
itemRouter.route("/")
    .post(authenticateToken, addItem)
    .get(authenticateToken, listAllItems);

//Without token
// itemRouter.route("/")
//     .post(addItem)
//     .get(listAllItems);
itemRouter.get("/download", authenticateToken, download);
module.exports = itemRouter;

