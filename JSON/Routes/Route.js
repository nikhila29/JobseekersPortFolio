const express = require("express")
const router = express.Router();
const fs = require('fs');
const userRoutes = require('./user.js')
const authRoutes = require('./auth.js')

router.use(userRoutes)
router.use(authRoutes)
module.exports = router;
