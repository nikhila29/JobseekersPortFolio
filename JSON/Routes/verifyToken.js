var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const dataPath = './userAuth.json';
const secretKey = 'nikhilasupersecreatkey'
const verifyToken = (req, res, next) => {
    const token= req.headers.authorization; // Assuming the token is sent in the 'Authorization' header
    // const token = tokenn.slice(7)
    console.log('token----', token);
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Token not provided" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token is invalid" });
        }
        req.user = decoded; // Store the decoded token payload in the request object
        next();
    });
}

module.exports = verifyToken;