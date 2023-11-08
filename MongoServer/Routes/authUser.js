const express = require("express");
const authRoutes = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const User = mongoose.model("User");
// const User = require('../models/user');
const bcrypt = require('bcrypt')
const axios = require('axios');
const { JWT_SECRET } = require('../config/keys')
const verifyToken = require('../middleware/verifyToken');


authRoutes.post('/register', async (req, res) => {
	const { firstName, lastName, email, password, role } = req.body

	if (!firstName || !lastName || !email || !password || !role) {
		return res.status(422).json({ error: "Please add all the fields" })
	}

	const ipInfoResponse = await axios.get('https://ipinfo.io');
	const location = ipInfoResponse.data.city; // You can customize this based on your needs

	User.findOne({ email: email })
		.then((savedUser) => {

			if (savedUser) {
				return res.status(422).json({ errorMsg: "User already exists with that email" })
			}


			bcrypt.hash(password, 12)
				.then(hashedpassword => {
					const user = new User({
						firstName,
						lastName,
						email,
						password: hashedpassword,
						role,
						location: location
					})

					user.save()
						.then(user => {
							res.json({ successMessage: "User Registered Successfully", user })
						})
						.catch(err => {
							console.log(err)
						})
				})

		})
		.catch(err => {
			console.log(err)
		})
})


authRoutes.post('/login', (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(422).json({ error: "Please add email or password" })
	}

	User.findOne({ email: email })
		.then(savedUser => {

			if (!savedUser) {
				return res.status(422).json({ error: "Invalid Email or password" })
			}

			bcrypt.compare(password, savedUser.password)
				.then(doMatch => {
					if (doMatch) {
						// res.json({message:"successfully signed in"})
						const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
						const { _id, firstName, lastName, email, role } = savedUser
						res.json({ successMessage: "User Successfully Signed In", token, user: { _id, firstName, lastName, email, role } })
					}
					else {
						return res.status(422).json({ error: "Invalid Email or password" })
					}
				})
				.catch(err => {
					console.log(err)
				})
		})
})

authRoutes.get('/all/registered-users', verifyToken, async (req, res) => {
	try {
		const allUsers = await User.find({ role: "employee" });
		// const users = await User.findOne({ role: "employee" })
		console.log(allUsers)
		res.send({ success: true, allUsers });
	} catch (error) {
		res.status(500).send({ success: false, error });
	}
})

authRoutes.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});


module.exports = authRoutes;

