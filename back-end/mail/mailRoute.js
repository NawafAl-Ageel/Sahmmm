const { welcomeEmail,acceptEmail,rejectEmail,resetPasswordEmail} = require('./templates.js');

const sendWelcomeEmail = async (transporter, email, name) => {
    if (!transporter || !email || !name) {
        return {
            success: false,
            error: 'Missing required parameters'
        };
    }
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "أهلًا بك في منصة ساهم!",
            html: welcomeEmail(name)
        };
        
        const result = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: result.messageId
        };
    } catch (error) {
        console.error('Email sending failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
const sendAcceptEmail = async (transporter, name , email , opportunityName) => {
    if (!transporter  || !name || !email || !opportunityName) {
        return {
            success: false,
            error: 'Missing required parameters'
        };
    }
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "تم قبول طلب التطوع الخاص بك!",
            html: acceptEmail(name, opportunityName)
        };
        
        const result = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: result.messageId
        };
    } catch (error) {
        console.error('Email sending failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const sendRejectEmail = async (transporter, name, email , opportunityName) => {
    if (!transporter  || !name || !email || !opportunityName) {
        return {
            success: false,
            error: 'Missing required parameters'
        };
    }
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "تحديث بخصوص طلب التطوع",
            html: rejectEmail(name, opportunityName)
        };
        
        const result = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: result.messageId
        };
    } catch (error) {
        console.error('Email sending failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
const sendResetPasswordEmail = async (transporter, name, email, otp) => {
    if (!transporter || !name || !email || !otp) {
        return {
            success: false,
            error: 'Missing required parameters'
        };
    }
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "رمز التحقق - إعادة تعيين كلمة المرور - منصة ساهم",
            html: resetPasswordEmail(name, otp)
        };
        
        const result = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: result.messageId
        };
    } catch (error) {
        console.error('Email sending failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
module.exports = {
    sendWelcomeEmail,
    sendAcceptEmail,
    sendRejectEmail,
    sendResetPasswordEmail
};