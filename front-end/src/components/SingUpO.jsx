import { useState } from 'react';
import axios from 'axios';
import './SignUp.css'; // Apply the existing SignUp CSS
import './SignUpO.css';


const SignUpO = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Individual error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [success, setSuccess] = useState(''); // Success message

  const isValidEmail = (email) => {
    const emailRegex = /^[\w-\.]+@(gmail|outlook)\.com$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and success message
    setNameError('');
    setEmailError('');
    setAddressError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSuccess('');

    let hasError = false;

    // Validate name
    if (!name) {
      setNameError('الاسم مطلوب');
      hasError = true;
    }

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError('البريد يجب ان يتضمن @gmail.com أو @outlook.com');
      hasError = true;
    }

    // Validate address
    if (!address) {
      setAddressError('العنوان مطلوب');
      hasError = true;
    }

    // Validate password
    if (password.length < 8) {
      setPasswordError('كلمة المرور يجب ألا تقل عن 8 خانات');
      hasError = true;
    }

    if (!isStrongPassword(password)) {
      setPasswordError('كلمة السر يجب أن يتضمن أحرف كبيرة وصغيرة وأرقام ورموز');
      hasError = true;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('كلمة السر غير متطابقة');
      hasError = true;
    }

    // If any error is present, return early
    if (hasError) {
      return;
    }

    // If no errors, proceed with sign up
    try {
      const response = await axios.post('http://localhost:5000/singup-organization', {
        name,
        email,
        address,
        password,
      });
      console.log(response.data.message);
      setSuccess('!تم إنشاء الحساب بنجاح');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setEmailError('لديك حساب موجود بهذا البريد');
      } else {
        setSuccess('');
      }
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div className="signup-form">
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">تسجيل حساب المنظمة</h2>

        <label className="rtl-text">اسم المنظمة:</label>
        {nameError && <p className="error-message">{nameError}</p>}
        <input
          className="input-field"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم"
        />

        <label className="rtl-text">البريد الإلكتروني:</label>
        {emailError && <p className="error-message">{emailError}</p>}
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="(yourname@gmail.com) مثل"
        />

        <label className="rtl-text">العنوان:</label>
        {addressError && <p className="error-message">{addressError}</p>}
        <input
          className="input-field"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="العنوان"
        />

        <label className="rtl-text">كلمة السر:</label>
        {passwordError && <p className="error-message">{passwordError}</p>}
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر"
        />

        <label className="rtl-text">تأكيد كلمة السر:</label>
        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
        <input
          className="input-field"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تأكيد كلمة السر"
        />

        {success && <p className="success-message">{success}</p>}

        <button className="submit-button" type="submit">انشاء حساب</button>
      </form>
    </div>
  );
};

export default SignUpO;
