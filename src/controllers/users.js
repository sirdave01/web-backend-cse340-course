import bcrypt from 'bcrypt';

import { createUser, authenticateUser } from '../models/users.js';

import { body, validationResult } from 'express-validator';

const userValidation = [

    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be between 3 and 100 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters'),
    
    body('confirm_password')
        .trim()
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

// Create a showUserRegistrationForm controller function
// that renders the registration form view register (which you will create in a future step).

// Create a processUserRegistrationForm controller function to handle the registration
// logic of creating the new user, including hashing the password and saving the user.

const showUserRegistrationForm = (req, res) => {

    const title = 'User Registration';

    res.render('register', { title });

 };

const processUserRegistrationForm = async (req, res) => {

    const { name, email, password } = req.body || {};

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/register');

    }

    try {

         // Hash the password before storing it
        const salt = await bcrypt.genSalt(14);
        const password_hash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, password_hash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/');

    } catch (error) {

        console.error('Error registering user:', error);

        if (error.message === 'Email already in use') {
            req.flash('error', 'This email address is already registered. Please use another email or log in.');
            return res.redirect('/register');
        }

        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }

};
 
// Create a function called showLoginForm that renders the login view.

const showLoginForm = (req, res) => {

    const title = 'User Login';

    res.render('login', { title });

};

// Create a function called processLoginForm that does the following:
// Gets the email and password from the request body.
// Calls authenticateUser with the email and password.
// Check to see if a user object is returned. If so:
// Add the user object to the session object: req.session.user = user;.
// Add a success flash message that the login was successful.
// Add a console.log() statement to log the user in the console for debugging purposes.
// Redirect to the home page.
// If authentication fails (the function returns null):
// Add an error flash message that the login failed.
// Redirect the user back to the login page.

const processLoginForm = async (req, res) => {

    const { email, password } = req.body || {};

    try {

        const user = await authenticateUser(email, password);

        if (user) {

            req.session.user = user;

            req.flash('success', 'Login successful!');

            console.log('Logged in user:', user);

            return res.redirect('/');

        } else {

            req.flash('error', 'Invalid email or password. Please try again.');

            return res.redirect('/login');

        }

    } catch (error) {

        console.error('Error during login:', error);

        req.flash('error', 'An error occurred during login. Please try again.');

        return res.redirect('/login');

    }

};

// Create a function called processLogout that does the following:
// Destroys the session using req.session.destroy()
// Adds a success flash message indicating the user has logged out.
// Redirects the user to the login page

const processLogout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            console.error('Error destroying session:', err);
        }

        req.flash('success', 'You have been logged out.');
        return res.redirect('/login');

    });

};

export { showUserRegistrationForm, processUserRegistrationForm, userValidation, processLoginForm, processLogout };