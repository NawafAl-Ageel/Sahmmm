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
      setNameError('Name is required.');
      hasError = true;
    }

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError('Email must end with @gmail.com or @outlook.com.');
      hasError = true;
    }

    // Validate birthday
    if (!birthday) {
      setBirthdayError('Birthday is required.');
      hasError = true;
    }

    // Validate password
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      hasError = true;
    }

    if (!isStrongPassword(password)) {
      setPasswordError('Password must include an uppercase letter, a lowercase letter, a digit, and a special character.');
      hasError = true;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    }

    // Validate city
    if (!city) {
      setCityError('City is required.');
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
        <label>Name:</label>
        {nameError && <p style={{ color: 'red', display: 'inline' }}> {nameError}</p>}
        <input
          className='inputDispalyBlock'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <label>Email:</label>
        {emailError && <p style={{ color: 'red', display: 'inline' }}> {emailError}</p>}
        <input
          className='inputDispalyBlock'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (e.g., yourname@gmail.com)"
        />

        <label>Birthday:</label>
        {birthdayError && <p style={{ color: 'red', display: 'inline' }}> {birthdayError}</p>}
        <input
          className='inputDispalyBlock'
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <label>City:</label> {/* Add label for city */}
        {cityError && <p style={{ color: 'red', display: 'inline' }}>{cityError}</p>}
        <input
          className='inputDispalyBlock'
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />

        <label>Password:</label>
        {passwordError && <p style={{ color: 'red', display: 'inline' }}>{passwordError}</p>}
        <input
          className='inputDispalyBlock'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <label>Confirm Password:</label>
        {confirmPasswordError && <p style={{ color: 'red', display: 'inline' }}>{confirmPasswordError}</p>}
        <input
          className='inputDispalyBlock'
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />

        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
export default SignUpV;
