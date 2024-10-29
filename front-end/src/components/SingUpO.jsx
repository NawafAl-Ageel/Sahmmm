import { useState } from 'react';
import axios from 'axios';



const SignUp = () => {
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
      setConfirmPasswordError(' كلمة السر غير متطابقة ');
      hasError = true;
    }

    // Validate role
    

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
        password
      });
      console.log(response.data.message);
      setSuccess('Account created successfully!');
    } catch (error) {
      if (error.response && error.response.status === 400) { // Assuming the server returns status 409 for duplicate email
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
            <label className='rtl-text'>اسم المنظمة:</label>
            {nameError && <p className='rtl-text' style={{ color: 'red',display:"inline" }}> {nameError}</p>} {/* Error message for name */}
            <input
              className='inputDispalyBlock'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <label className='rtl-text'>البريد الالكتروني:</label>
            {emailError && <p className='rtl-text' style={{ color: 'red',display:"inline" }}> {emailError}</p>} {/* Error message for email */}
            <input
              className='inputDispalyBlock'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (e.g., yourname@gmail.com)"
            />

            <label className='rtl-text'>العنوان:</label>
            {addressError && <p className='rtl-text' style={{ color: 'red',display:"inline" }}> {addressError}</p>} {/* Error message for address */}
            <input
              className='inputDispalyBlock'
              type="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />

            <label className='rtl-text'>كلمة السر:</label>
            {passwordError && <p className='rtl-text' style={{ color: 'red',display:"inline" }}> {passwordError}</p>} {/* Error message for password */}
            <input
              className='inputDispalyBlock'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <label className='rtl-text'>تأكيد كلمة السر:</label>
            {confirmPasswordError && <p className='rtl-text' style={{ color: 'red',display:"inline" }}> {confirmPasswordError}</p>} {/* Error message for confirm password */}
            <input
              className='inputDispalyBlock'
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            

            
            
            {success && <p style={{ color: 'green',textAlign:"center" }}>{success}</p>} {/* Success message */}
            <br />
            <button type="submit">انشاء حساب</button>
          </form>
          
         
        </div>
  );
};
export default SignUp;