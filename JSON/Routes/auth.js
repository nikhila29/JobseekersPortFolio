const { json } = require("body-parser");
const express = require("express");
const authRoutes = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');

const dataPath = './userAuth.json';
const secretKey = 'nikhilasupersecreatkey'
var VerifyToken = require('./verifyToken');


//util functions

const saveUserAuthData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

const getUserAuthData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}

//reading registered user data

authRoutes.get('/all/registered-users', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if(err) {
            throw err;
        }
        res.send(JSON.parse(data))
    })
})

//register user and add user to the json db server

authRoutes.post('/register', (req, res) => {
    
    var exitAuthUsers = getUserAuthData()

    const {firstName, lastName, email, password} = req.body

    if(!email || !password || !firstName || !lastName){
        return res.status(422).json({error:"Please add all the fields"})
    }

    const existEmail = exitAuthUsers.find(obj => (obj.email === req.body.email))
    if(existEmail){
        res.send({ success: false, error: 'User Already Registered...!', data: existEmail });
        console.log('exist--', existEmail);
    } else{
        exitAuthUsers.push(req.body)
        console.log('123',req.body);
        saveUserAuthData(exitAuthUsers)
        const token = jwt.sign({ email: req.body.email }, secretKey, { expiresIn: "1h" });
        res.send({
            success: true,
            message: 'User Registered Successfully',
            token: token
        });
        // res.status(200).send({ auth: true, token: token });
    }
 
})


//login user after registering
authRoutes.post('/login', (req, res) => {
    var exitAuthUsers = getUserAuthData()
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
     }
    const result = exitAuthUsers.find(obj => (obj.email === req.body.email && obj.password === req.body.password))
    if (result) {
        // Generate JWT token
        const token = jwt.sign({ email: req.body.email }, secretKey, { expiresIn: "1h" });

        res.send({
            success: true,
            message: 'User Logged In Successfully',
            data: result,
            token: token
        });
    } else {
        res.send({ success: false, error: 'User Needs to Register...!', data: result });
    }
})

authRoutes.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

module.exports = authRoutes;

