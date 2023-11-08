const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        required: true,
        enum: ['recruiter', 'employee']
    },
    location: {
        type: String,
        required: true
    }
},{timestamps:true})

mongoose.model("User", userSchema)