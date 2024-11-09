// controllers/Controllers.js

const connection = require('../config/database');
const bcrypt = require('bcryptjs');

// Registration function
exports.register = (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.render('register', { error: 'Database error' });
        }

        if (results.length > 0) {
            return res.render('register', { error: 'Username already exists' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.render('register', { error: 'Error hashing password' });
            }

            connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
                if (err) {
                    return res.render('register', { error: 'Database error' });
                }

                res.render('register', { success: 'Registration successful! You can now login.' });
            });
        });
    });
};

// Login function
exports.login = (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.render('login', { error: 'Database error' });
        }

        if (results.length === 0) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) {
                return res.render('login', { error: 'Invalid username or password' });
            }

            // Set user session after successful login
            req.session.user = {
                id: user.id,
                username: user.username,
                // Add any other user data you want to store in session
            };
            req.session.isLoggedIn = true;

            res.redirect('/index');
        });
    });
};

// Logout function
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Error logging out');
        }
        // Redirect to login page after destroying the session
        res.redirect('/login');
    });
};

// Check auth status
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user && req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};