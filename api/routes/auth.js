const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            // More specific error message
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ message: 'Email already in use' });
            } else {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        // Create new user
        const user = new User({
            username,
            email: email.toLowerCase(),
            passwordHash: password, // Will be hashed by pre-save hook
            firstName,
            lastName
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Set token in header
        res.header('x-auth-token', token);
        
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            coverPhoto: user.coverPhoto,
            bio: user.bio
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: Object.values(error.errors).map(err => err.message) 
            });
        } else if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate key error' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(500).json({ message: 'Error creating authentication token' });
        }
        
        res.status(500).json({ 
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;        
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Set token in header
        res.header('x-auth-token', token);

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            coverPhoto: user.coverPhoto,
            bio: user.bio
        });

    } catch (error) {
        console.error('Login error:', error);
        
        // Handle different types of errors
        if (error.name === 'MongoError') {
            return res.status(500).json({ message: 'Database error during login' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(500).json({ message: 'Error creating authentication token' });
        }
        
        res.status(500).json({ 
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message
        });
    }
});

module.exports = router;