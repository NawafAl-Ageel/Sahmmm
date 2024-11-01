import { useState } from 'react';
import axios from 'axios';
import './SignUpV.css'; // Import the new CSS for styling

const SignUpV = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [success, setSuccess] = useState('');

  // Individual error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [cityError, setCityError] = useState('');
  const [genderError, setGenderError] = useState('');

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
    setBirthdayError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setCityError('');
    setGenderError('');
    setSuccess('');
    let hasError = false;

    // Validate gender
    if (!gender) {
      setGenderError('يرجى اختيار الجنس');
      hasError = true;
    }
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

    // Validate birthday
    if (!birthday) {
      setBirthdayError(' يجب ادخال تاريخ الميلاد');
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

    // Validate city
    if (!city) {
      setCityError('يجب ادخال المدينة');
      hasError = true;
    }

    // If any error is present, return early
    if (hasError) {
      return;
    }

    // If no errors, proceed with sign up
    try {
      const response = await axios.post('http://localhost:5000/signup-volunteer', {
        name,
        email,
        birthday,
        password,
        city,
        gender
      });
      console.log(response.data.message);
      setSuccess('تم إنشاء الحساب بنجاح!');
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
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <label className="rtl-text">اسم المساهم:</label>
        {nameError && <p className="error-text">{nameError}</p>}
        <input
          className="input-field"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم"
        />

        <label className="rtl-text">البريد الإلكتروني:</label>
        {emailError && <p className="error-text">{emailError}</p>}
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="(yourname@gmail.com) مثل"
        />

        <label className="rtl-text">تاريخ الميلاد:</label>
        {birthdayError && <p className="error-text">{birthdayError}</p>}
        <input
          className="input-field"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <label className="rtl-text">المدينة:</label>
        {cityError && <p className="error-text">{cityError}</p>}
        <input
          className="input-field"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="المدينة"
        />

        <label className="rtl-text">كلمة السر:</label>
        {passwordError && <p className="error-text">{passwordError}</p>}
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر"
        />

        <label className="rtl-text">تأكيد كلمة السر:</label>
        {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}
        <input
          className="input-field"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تأكيد كلمة المرور"
        />

<label className="rtl-text">الجنس:</label>
{genderError && <p className="error-text">{genderError}</p>}
<div className="gender-selection">
  <label>
    <input
      type="radio"
      name="gender"
      value="male"
      checked={gender === 'male'}
      onChange={(e) => setGender(e.target.value)}
    />
    <i className="fas fa-mars"></i> ذكر
    <img src='public/male.png'></img>
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="female"
      checked={gender === 'female'}
      onChange={(e) => setGender(e.target.value)}
    />
    <i className="fas fa-venus"></i> أُنثى
    <img src='public/female.png'></img>
  </label>
</div>

        {success && <p className="success-text">{success}</p>}
        <button type="submit" className="signup-button">انشاء حساب</button>
      </form>
    </div>
  );
};

export default SignUpV;
