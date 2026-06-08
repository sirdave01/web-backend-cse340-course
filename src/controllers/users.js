import bcrypt from 'bcrypt';

import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

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

            if (res.locals.NODE_ENV === 'development') {
                 
                console.log('User logged in:', user);
            }

            return res.redirect('/dashboard');

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

    if (req.session.user) {
       
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');

    res.redirect('/login');

};

// Create a function called requireLogin that does the following:
// Checks if req.session.user exists.
// If it does not exist, the function should set an error flash message and redirect the user to the login page.
// If the user exists on the session, the function should call next() to allow the request to continue.

const requireLogin = (req, res, next) => {

    if (!req.session.user) {

        req.flash('error', 'You must be logged in to access this page.');

        return res.redirect('/login');

    }

    next();

};

// Create a new function called showDashboard that does the following:
// Gets the user's name and email from req.session.user.
// Renders the dashboard.ejs view and passes the name and email address to it.

const showDashboard = (req, res) => {

    const { name, email } = req.session.user || {};

    const title = 'User Dashboard';

    const volunteeredProjects = res.locals.volunteeredProjects || [];

    res.render('dashboard', { title, name, email, volunteeredProjects });

};

// Create a new function called requireRole. This function should accept a parameter called role 
// that specifies which role is required.
// Inside the function, return another function that has the standard middleware parameters: 
// req, res, and next.
// In the inner function, check if req.session.user exists and if req.session.user.
// role_name matches the required role.
// If the user has the required role, call next() to allow the request to continue.
// If the user does not have the required role, set an error flash message and 
// redirect to the root / page.

const requireRole = (role) => {

    return (req, res, next) => {

        if (req.session.user && req.session.user.role_name === role) {

            return next();

        } else {

            req.flash('error', 'You do not have permission to access this page.');

            return res.redirect('/');

        }

    };
    
};

// create a new function that display all registered users in the system. This function should be called showUsers and should do the following:
// Check if the user is logged in and has the admin role. If not, redirect to the dashboard page with an error message.
// If the user is an admin, retrieve all users from the database and render a view called users.ejs, passing the list of users with their names, email(username) and role to the view.

const showUsers = async (req, res) => {

    if (!req.session.user || req.session.user.role_name !== 'admin') {

        req.flash('error', 'You do not have permission to access this page.');

        return res.redirect('/dashboard');

    }

    try {

        const users = await getAllUsers();

        const { name, email } = req.session.user;

        const title = 'Registered Users';

        res.render('users', { title, users, name, email });

    }

    catch (error) {

        console.error('Error fetching users:', error);

        req.flash('error', 'An error occurred while fetching users. Please try again.');
        
        return res.redirect('/');

    }

};

export {
    showUserRegistrationForm, processUserRegistrationForm, showDashboard, showUsers,
    userValidation, processLoginForm, processLogout, requireRole,
    showLoginForm, requireLogin
};