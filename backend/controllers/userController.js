const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { fullName } = req.body;

        // Check if all files were uploaded
        const files = req.files;
        if (!files || !files.aadhaarFront || !files.aadhaarBack || !files.panCard || !files.passbook || !files.paymentScreenshot) {
            return res.status(400).json({ message: 'All documents and payment screenshot are required' });
        }

        const newUser = new User({
            fullName,
            aadhaarFront: files.aadhaarFront[0].path,
            aadhaarBack: files.aadhaarBack[0].path,
            panCard: files.panCard[0].path,
            passbook: files.passbook[0].path,
            paymentScreenshot: files.paymentScreenshot[0].path
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: newUser
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    console.log('--- getAllUsers called ---');
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { fullName: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, getAllUsers, deleteUser };
