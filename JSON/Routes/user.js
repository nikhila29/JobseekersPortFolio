const express = require("express")
const userRoutes = express.Router();
const fs = require('fs');
const verifyToken = require('./verifyToken'); 
const axios = require('axios');

const dataPath = './db.json';

// util functions 
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

const getUserData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}


// reading the data
userRoutes.get('/user', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
    });
});


//add user to the json file

userRoutes.post('/user/add', verifyToken, async (req, res) => {
    const exitUsers = getUserData();
    const userId = req.params.id;

    // Obtain the user's estimated location based on IP address
    try {
        const ipInfoResponse = await axios.get('https://ipinfo.io');
        const location = ipInfoResponse.data.city; // You can customize this based on your needs
        const currentDate = new Date();

        // Check if the user with the provided ID already exists
        const existingUser = exitUsers.find(user => user.id === req.body.id);
        if (!existingUser) {
            // Add createdAt and location fields to the user data
            const newUser = {
                ...req.body,
                createdAt: currentDate,
                location: location
            };

            exitUsers.push(newUser);

            // Save the updated user data to storage
            saveUserData(exitUsers);

            res.send({ success: true, msg: 'User data added successfully' });
        } else {
            res.send({ success: false, error: 'ID already exists' });
        }
    } catch (error) {
        console.error('Error fetching IP information:', error);
        res.status(500).send({ success: false, error: 'Internal server error' });
    }
});

// Read - get all users from the json file
userRoutes.get('/user/list', verifyToken, (req, res) => {
    // const index = exitUsers.find(user =>user.id=== req.body.id);
    const users = getUserData()
    res.send(users)
})

// Update - using Put method

userRoutes.put('/user/:id', verifyToken, (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        var exitUsers = getUserData();
        const userId = req.params.id;

        const userData = exitUsers.find(user => user.id === userId);

        if (userData) { // Check if userData exists
            // Update the user data
            Object.assign(userData, req.body); // Merge the updated data
            saveUserData(exitUsers);
            res.send({ success: true, msg: `User with id ${userId} has been updated` });
        } else {
            res.send({ success: false, error: `User with id ${userId} not found` });
        }
    });
});

//delete - using delete method

userRoutes.delete('/user/delete/:id', verifyToken, (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        var exitUsers = getUserData();
        const userId = req.params['id'];

        const index = exitUsers.findIndex(user => user.id === userId);
        if (index !== -1) {
            exitUsers.splice(index, 1);
            saveUserData(exitUsers);
            res.status(200).json({ message: `User with ID ${userId} has been deleted` });
        } else {
            res.status(404).json({ message: `User with ID ${userId} not found` });
        }
    });
});

module.exports = userRoutes