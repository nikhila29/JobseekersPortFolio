const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    match: /^[a-zA-Z ]+$/,
  },
  lastName: {
    type: String,
    required: true,
    match: /^[a-zA-Z ]+$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  user_id: {
    type: Object,
    required: true
  }
},{timestamps:true});

mongoose.model("Post",postSchema)