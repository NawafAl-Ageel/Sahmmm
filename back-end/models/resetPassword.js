// resetPasswordModel.js
const mongoose = require('mongoose');

const ResetPasswordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['volunteer', 'organization']
    }
    });

const ResetPassword = mongoose.model('ResetPassword', ResetPasswordSchema);
module.exports = ResetPassword;