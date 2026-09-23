const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = async (req, res) => {
    // Validate required registration fields
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // Normalize email before checking the database
    const normalizedEmail = req.body.email.trim().toLowerCase();

    try {
        // Prevent duplicate user accounts
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: 'An account with this email already exists'
            });
        }

        const user = new User();
        user.name = req.body.name.trim();
        user.email = normalizedEmail;
        user.setPassword(req.body.password);

        await user.save();

        const token = user.generateJwt();

        return res.status(200).json({
            token
        });
    } catch (err) {
        // Handle duplicate-key errors from MongoDB as a fallback
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'An account with this email already exists'
            });
        }

        return res.status(500).json({
            message: 'Unable to create account'
        });
    }
};
const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "All fields required"
        });
    }

    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user || !user.validPassword(req.body.password)) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = user.generateJwt();

        res.status(200).json({
            token
        });

    } catch (err) {
        res.status(404).json(err);
    }
};

module.exports = {
    register,
    login
};