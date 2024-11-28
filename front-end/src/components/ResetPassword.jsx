import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import './SignIn.css';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, role } = location.state || {};

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    useEffect(() => {
        if (!email || !role) {
        navigate('/signin');
        }
    }, [email, role, navigate]);

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        
        if (!email || !role || !otp) {
        setMessage('جميع الحقول مطلوبة');
        return;
        }

        setIsLoading(true);
        setMessage('');

        try {
        const response = await axios.post('http://localhost:5000/verify-otp', {
            email,
            role,
            otp
        });
        
        setIsOtpVerified(true);
        setMessage('تم التحقق من الرمز بنجاح');
        } catch (error) {
        setMessage(
            error.response?.data?.message || 
            'رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى'
        );
        } finally {
        setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
        setMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
        }
    
        if (newPassword !== confirmPassword) {
        setMessage('كلمات المرور غير متطابقة');
        return;
        }
    
        setIsLoading(true);
        setMessage('');
    
        try {
        const response = await axios.post('http://localhost:5000/reset-password', {
            email,
            role,
            otp,
            newPassword
        });
        
        setMessage('تم تغيير كلمة المرور بنجاح');
        setTimeout(() => {
            navigate('/signin');
        }, 2000);
        } catch (error) {
            setMessage(
                error.response?.data?.message || 
                'حدث خطأ. الرجاء المحاولة مرة أخرى'
            );
        } finally {
            setIsLoading(false);
        }
    };

return (
    <div>
        <Header />
        <div className='main-section'>
            <div className="content">
            <div className="donation-form">
                <h1 className="main-title">إعادة تعيين كلمة المرور</h1>
                {message && <p className={message.includes('نجاح') ? 'success-message' : 'error-message'}>{message}</p>}
                
                {!isOtpVerified ? (
                // نموذج التحقق من OTP
                <form onSubmit={handleOtpVerification}>
                    <label className="log-in">:رمز التحقق</label>
                    <input
                    className="inputDispalyBlock"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="أدخل رمز التحقق"
                    required
                    />
                    
                    <button type="submit" className="login-button">
                    {isLoading ? <div className="loader"></div> : 'تحقق من الرمز'}
                    </button>
                </form>
                ) : (
                // نموذج تغيير كلمة المرور
                <form onSubmit={handlePasswordReset}>
                    <label className="log-in">كلمة المرور الجديدة:</label>
                    <input
                    className="inputDispalyBlock"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة"
                    required
                    />
                    
                    <label className="log-in">تأكيد كلمة المرور</label>
                    <input
                    className="inputDispalyBlock"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور"
                    required
                    />
                    
                    <button type="submit" className="login-button">
                    {isLoading ? <div className="loader"></div> : 'تغيير كلمة المرور'}
                    </button>
                </form>
                )}
            </div>
            </div>
        </div>
        </div>
    );
};

export default ResetPassword;