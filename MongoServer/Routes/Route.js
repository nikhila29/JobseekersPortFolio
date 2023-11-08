const express = require("express")
const router = express.Router();
const postRoutes = require('./post.js')
const userRoutes = require('./authUser.js')


router.use(userRoutes)
router.use(postRoutes)

module.exports = router;
