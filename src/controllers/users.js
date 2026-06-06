import bcrypt from 'bcrypt';

import { createUser } from '../models/users.js';

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

export { showUserRegistrationForm, processUserRegistrationForm, userValidation };