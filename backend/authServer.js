const express = require('express');
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
// const cookieParser = require("cookie-parser");
const User = require('./models/userSchema');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cookieParser);
const mongoose = require("mongoose");
const sendEmail = require('./utils/sendEmail');
const URI = process.env.MONGO_URI;
app.use(bodyParser.json());

const port = 4000;
mongoose
    .connect(URI)
    .then((result) => {
        console.log("connected");
        console.log(`Auth server listening on port ${port}`);
        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });
function generatePassword() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyz$@!#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
app.post(process.env.REG_URL, async (req, res) => {
    const userID = req.body.userID;
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name: req.body.name, club: req.body.club, userID: req.body.userID, mobileNumber: req.body.mobileNumber, password: hashedPassword, superUser: req.body.superUser });
    try {
        await user.save();
        sendEmail(userID, "Registered on IMS Portal", `You have been registered on IMS Portal. Your login details are as follows:<br>User ID: ${userID}<br>Password: ${password}<br><br>Please note that this is a randomly generated password only known to you. Use this for logging in to the portal.<br><br>Warm Regards,<br>Coding Club IITG`)
        return res.status(201).send(user);
    }
    catch (err) {
        return res.status(500).send(err);
    }
})
app.post('/updatePassword', async (req, res) => {
    const userID = req.body.userID;
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.findOneAndUpdate({userID: userID},{password: password});
        sendEmail(userID, "Password Updated on IMS Portal", `Your password has been updated on IMS Portal. Your login details are as follows:<br>User ID: ${userID}<br>Password: ${password}<br><br>Please note that this is a randomly generated password only known to you. Use this for logging in to the portal.<br><br>Warm Regards,<br>Coding Club IITG`)
        return res.status(201).send(user);
    }
    catch (err) {
        return res.status(500).send(err);
    }
})

app.post('/login', async (req, res) => {
    console.log("Login API called");
    const userID = req.body.userID;
    const user = await User.findOne({ userID: userID });
    const user1 = user ? { userID: user.userID, club: user.club, superUser: user.superUser } : null;
    if (user == null) {
        console.log("User not found");
        return res.status(401).json({ result: "Invalid" });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            console.log("Successfully logged in");
        } else {
            console.log("Wrong pw");
            return res.status(401).json({ result: "Invalid" });
        }
    }
    catch (err) {

        console.log("error");
        return res.status(500).send(err);
    }
    const accessToken = jwt.sign(user1, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    // res.cookie('jwt', accessToken, {httpOnly: true});

    res.status(200).json({ jwt: accessToken, result: "Success", user: user._id });
});

// app.get('logout', (req, res) => {
//     res.cookie('jwt', '', { maxAge: 30 * 24 * 60 * 60 });
//     res.redirect('/login');
// })
app.post('/checkToken', (req, res) => {
    try {
        const token = req.body.jwt;
        if (token == null) return res.status(401).json({ result: "User not found" });
        else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(401).send(err);
                req.user = user;
                return res.status(200).send({ user: user });
            });
        }
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
// app.listen(4000);