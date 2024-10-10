const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the user.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Login GET route
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Login POST route
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return next(new Error('Error reading user data'));
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const user = users.find(user => user.email === email);
        if (!user || user.password !== password) {
            return res.status(401).render('login', { errorMessage: 'Invalid email or password' });
        }

        req.session.userId = user.email;
        return res.redirect('/user/dashboard'); // Redirect to the dashboard after successful login
    });
});

// Other user routes...

module.exports = router;
