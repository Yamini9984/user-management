const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the users file (ensure this path is correct)
const usersFilePath = path.join(__dirname, '../data/users.json');

// Handle POST request to /register
router.post('/', (req, res, next) => {
    const { first_name, last_name, email, password, confirm_password, phone } = req.body;

    // Check for missing fields or mismatched passwords
    if (!first_name || !last_name || !email || !password || password !== confirm_password) {
        return res.status(400).send('Please fill out all fields correctly.');
    }

    // Read existing users from the JSON file
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) return next(err);

        let users = [];
        if (data) users = JSON.parse(data);

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) return res.status(400).send('User already exists.');

        // Add new user
        users.push({ first_name, last_name, email, password, phone });

        // Write back to the file
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) return next(err);

            // Send a success response
            res.sendFile(path.join(__dirname, '../views', 'register_success.html'));
        });
    });
});

module.exports = router;
