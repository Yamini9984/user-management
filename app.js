const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose'); // Import mongoose
const app = express();

// MongoDB connection
const dbURL = 'mongodb://localhost:27017/221fa04617'; // Replace with your MongoDB URL and database name
mongoose.connect(dbURL)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routers
const indexRoute = require('./routes/index');
const registerRoute = require('./routes/registration');
const userRoute = require('./routes/user');
const subscribeRoute = require('./routes/subscribe');
const searchFlightRoute = require('./routes/searchFlight');
const dataRoute = require('./routes/data');

// Middleware: Static files and URL encoding
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Define Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'aboutus.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); // Adjust the path to your login.html file
});

// Handle Contact Form Submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    // Process the data (e.g., save it to a database or send an email)
    res.send('Contact form submitted successfully!');
});
app.set('view engine', 'ejs'); // If using EJS
app.get('/login', (req, res) => {
    res.render('login'); // Make sure this points to your EJS file
});

app.get('/login', (req, res) => {
    res.render('login', { errorMessage: null }); // Render login view with no error initially
});

app.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Received email: ${email}, password: ${password}`); // Log credentials

    if (email === 'test@example.com' && password === 'password') {
        res.send('Successfully logged in!'); // Send success message
    } else {
        res.status(401).send('Invalid email or password'); // Send error message
    }
});

// Route Handling
app.use('/register', registerRoute);
app.use('/user', userRoute);
app.post('/subscribe', subscribeRoute);
app.post('/search_flight', searchFlightRoute);
app.use('/data', dataRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    const statusCode = err.status || 500;
    res.status(statusCode).sendFile(path.join(__dirname, 'views', 'error.html'));
});

// Start the Server
const port = 9000;
app.listen(port, () => {
    console.log(`Server is running @ http://localhost:${port}`);
});
