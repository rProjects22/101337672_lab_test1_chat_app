const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../../config/config');

// Controller to handle user registration
exports.registerUser = async (req, res) => {
    const { username, firstname, lastname, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            firstname,
            lastname,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to handle user login
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'User authenticated successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


