const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    aadhaarFront: { type: String, required: true }, // Cloudinary URL
    aadhaarBack: { type: String, required: true },  // Cloudinary URL
    panCard: { type: String, required: true },      // Cloudinary URL
    passbook: { type: String, required: true },     // Cloudinary URL
    paymentScreenshot: { type: String, required: true } // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
