// var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// const {JWT_SECRET} = require('../config/keys')
// const mongoose = require('mongoose')
// const User = mongoose.model("User")

// const verifyToken = (req, res, next) => {
//     const token= req.headers.authorization; // Assuming the token is sent in the 'Authorization' header
//     // const token = tokenn.slice(7)
//     console.log('token----', token);
    
//     if (!token) {
//         return res.status(401).json({ success: false, message: "Token not provided" });
//     }

//     jwt.verify(token, JWT_SECRET, (err, payload) => {
//         if (err) {
//             return res.status(403).json({ success: false, message: "Token is invalid" });
//         }
//         const {_id} = payload
//         User.findById(_id).then(userdata=>{
//             req.user = userdata  //Store the payload token payload in the request object
//             next()
//         })
//         // req.user = payload; // Store the payload token payload in the request object
//         // next();
//     });
// }

// module.exports = verifyToken;

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// const secretKey = 'nikhilasupersecreatkey'
const {JWT_SECRET} = require('../config/keys')
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization; // Assuming the token is sent in the 'Authorization' header
    // const token = tokenn.slice(7)
    console.log('token----', token);
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Token not provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token is invalid" });
        }
        req.user = decoded; // Store the decoded token payload in the request object
        next();
    });
}

module.exports = verifyToken;