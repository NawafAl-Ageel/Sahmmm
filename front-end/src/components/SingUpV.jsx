import { useState } from 'react';
import axios from 'axios';

const SignUpV = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState(''); // Add city state

  // Individual error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [cityError, setCityError] = useState(''); // Add city error state
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
    setBirthdayError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setCityError(''); // Reset city error
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
      const response = await axios.post('http://localhost:5000/singup-volunteer', {
        name,
        email,
        birthday,
        password,
        city // Add city to the request payload
      });
      console.log(response.data.message);
      setSuccess('Account created successfully!');
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
    <div>
      <form onSubmit={handleSubmit}>
        <label className='rtl-text'>اسم المساهم:</label>
        {nameError && <p className='rtl-text' style={{ color: 'red', display: 'inline' }}> {nameError}</p>}
        <input
          className='inputDispalyBlock'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <label className='rtl-text'> البريد الاكتروني:</label>
        {emailError && <p className='rtl-text' style={{ color: 'red', display: 'inline' }}> {emailError}</p>}
        <input
          className='inputDispalyBlock'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (e.g., yourname@gmail.com)"
        />

        <label className='rtl-text'>تاريخ الميلاد:</label>
        {birthdayError && <p className='rtl-text' style={{ color: 'red', display: 'inline' }}> {birthdayError}</p>}
        <input
          className='inputDispalyBlock'
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <label className='rtl-text'>المدينة:</label> {/* Add label for city */}
        {cityError && <p className='rtl-text' style={{ color: 'red', display: 'inline' }}>{cityError}</p>}
        <input
          className='inputDispalyBlock'
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />

        <label className='rtl-text'>كلمة السر:</label>
        {passwordError && <p className='rtl-text' style={{ color: 'red', display: 'inline' }}>{passwordError}</p>}
        <input
          className='inputDispalyBlock'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <label className='rtl-text'>تأكيد كلمة السر:</label>
        {confirmPasswordError && <p className='rtl-text' style={{ color: 'red', display: 'inline' }}>{confirmPasswordError}</p>}
        <input
          className='inputDispalyBlock'
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />

        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        <br />
        <button type="submit">انشاء حساب</button>
      </form>
    </div>
  );
};
export default SignUpV;
