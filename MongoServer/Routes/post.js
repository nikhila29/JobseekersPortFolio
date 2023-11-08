const express = require("express");
const postRoutes = express.Router();
const axios = require("axios");
// const Post = require('../models/post');
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const verifyToken = require("../middleware/verifyToken");

// Create a new post
postRoutes.post("/user/add", verifyToken, async (req, res) => {
	try {
		const user = req.user;
		console.log('userrrrr--', user._id)
		const ipInfoResponse = await axios.get("https://ipinfo.io");
		const location = ipInfoResponse.data.city; // You can customize this based on your needs

 		// Check if the user has already created a post
		const existingPost = await Post.findOne({ user_id: user._id });

		if (existingPost) {
			console.log('gggg')
			return res.status(400).send({ errMsg: "You already created a PortFolio" });
		}
		// res.status(200).send({ auth: false, token: null });
		
		const postData = {
			...req.body,
			location: location,
			user_id: user._id
		};
		const post = new Post(postData);
		await post.save();
		res
			.status(201)
			.send({ success: true, message: "Successfully added", post });
	} catch (error) {
		res.status(400).send({ success: false, error: error });
	}
});

// Get all posts
postRoutes.get("/user/list", verifyToken, async (req, res) => {
	try {
		const posts = await Post.find();
		res.send({ success: true, posts });
	} catch (error) {
		res.status(500).send({ success: false, error });
	}
});

// Get an post by ID
postRoutes.get("/user/:id", verifyToken, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res
				.status(404)
				.send({ success: false, error: "Id not exist please check..." });
		}
		res.send(post);
	} catch (error) {
		res.status(500).send({ success: false, error });
	}
});

// Update an post by ID
postRoutes.put("/user/:id", verifyToken, async (req, res) => {
	try {
		const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!post) {
			return res
				.status(404)
				.send({ success: false, error: "Id not exist please check..." });
		}
		res.send({ success: true, message: "Updated Successfully...", post });
	} catch (error) {
		res
			.status(400)
			.send({ success: false, error: "Something going wrong...", error });
	}
});

// Delete an post by ID
postRoutes.delete("/user/delete/:id", verifyToken, async (req, res) => {
	try {
		const post = await Post.findByIdAndDelete(req.params.id);
		if (!post) {
			return res
				.status(404)
				.send({ success: false, error: "Id not exist please check...", error });
		}
		res.send({ success: true, message: "Deleted Successfully...", post });
	} catch (error) {
		res
			.status(500)
			.send({ success: false, error: "Something going wrong...", error });
	}
});

module.exports = postRoutes;
