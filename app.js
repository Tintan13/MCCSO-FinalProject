const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Add this line
const Routes = require('./routes/Routes');
const connection = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration - Add this before other middleware
app.use(session({
    secret: 'your-secret-key-here', // Change this to a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    connection.query('SELECT * FROM categories ORDER BY category_name ASC', (err, results) => {
        if (err) {
            console.error(err);
            res.locals.categories = [];
        } else {
            res.locals.categories = results;
        }
        next();
    });
});



// Serve static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));



// Make user session data available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Routes
app.use('/', Routes);

// Handle 404
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});