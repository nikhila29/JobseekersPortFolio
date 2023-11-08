const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs');
const cors = require("cors");
const PORT = 5001;

// create our express app
const app = express()
// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions ={
    origin:'*', 
    credentials:true,//access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
app.use(cors(corsOptions))
// route
const routes = require('./Routes/Route')
app.use('/', routes)



//start server
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
}) 