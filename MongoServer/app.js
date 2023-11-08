const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors");
const mongoose = require('mongoose');
const PORT = 5000;

// create our express app
const app = express()


const MONGODB_URI = 'mongodb+srv://nikhilabadri:yOzvwBDNjRARpCIW@cluster0.gty30uj.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log("conneted to mongo yeahhoo")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})
// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions ={
    origin:'*', 
    credentials:true,//access-control-allow-credentials:true
    optionSuccessStatus:200,
}

require('./models/user')
require('./models/post')
 
app.use(cors(corsOptions))
// route
const routes = require('./Routes/Route')
app.use('/', routes)




//start server
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
}) 