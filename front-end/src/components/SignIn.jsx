import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; 
import { Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = ({ setVolunteerToken, setOrganizationToken, setUser }) => {
  const [role, setRole] = useState('volunteer');
  const [volunteer, setVolunteer] = useState({ email: '', password: '' });
  const [organization, setOrganization] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setVolunteer((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrganizationChange = (e) => {
    const { name, value } = e.target;
    setOrganization((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/request-reset', {
        email: resetEmail,
        role: role
      });
      setResetMessage('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      navigate('/reset-password', { 
        state: { 
          email: resetEmail, 
          role: role 
        }
      });
    } catch (error) {
      setResetMessage(error.response?.data?.message || 'حدث خطأ. الرجاء التحقق من البريد الإلكتروني');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolunteerLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/signin-volunteer', {
        ...volunteer,
        role: 'volunteer',
      });
      localStorage.setItem('authToken', response.data.token);
      setVolunteerToken(response.data.token);
      setUser(response.data.user);
      setError('');
      setTimeout(() => {
        navigate('/volunteerhome');
      }, 1000);
    } catch (error) {
      setError('خطأ في تسجيل الدخول للمساهم: الرجاء التحقق من البريد الإلكتروني وكلمة المرور');
      console.error('Error logging in volunteer:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOrganizationLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/signin-organization', {
        ...organization,
        role: 'organization',
      });
      localStorage.setItem('authToken', response.data.token);
      setOrganizationToken(response.data.token);
      setUser(response.data.user);
      setError('');
      setTimeout(() => {
        navigate('/organizationhome');
      }, 1000);
    } catch (error) {
      setError('خطأ في تسجيل الدخول للمنظمة: الرجاء التحقق من البريد الإلكتروني وكلمة المرور');
      console.error('Error logging in organization:', error.response?.data);
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
            <h1 className="main-title">تسجيل الدخول</h1>

            <div className="radio-group">
              <label>منظمة
                <input
                  className="radio-group"
                  type="radio"
                  name="role"
                  value="organization"
                  checked={role === 'organization'}
                  onChange={() => setRole('organization')}
                />
              </label>

              <label className="radio-inline">مساهم
                <input
                  className="radio-group"
                  type="radio"
                  name="role"
                  value="volunteer"
                  checked={role === 'volunteer'}
                  onChange={() => setRole('volunteer')}
                />
              </label>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!showForgotPassword ? (
              <>
                {role === 'volunteer' ? (
                  <form onSubmit={handleVolunteerLogin}>
                    <label className="log-in">البريد الالكتروني:</label>
                    <input
                      className="inputDispalyBlock"
                      type="email"
                      name="email"
                      placeholder="البريد الالكتروني للمساهم"
                      value={volunteer.email}
                      onChange={handleVolunteerChange}
                      required
                    />
                    <label className="log-in">كلمة السر:</label>
                    <input
                      className="inputDispalyBlock"
                      type="password"
                      name="password"
                      placeholder="كلمة السر"
                      value={volunteer.password}
                      onChange={handleVolunteerChange}
                      required
                    />
                    <button type="submit" className="login-button">
                      {isLoading ? <div className="loader"></div> : 'تسجيل الدخول'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOrganizationLogin}>
                    <label className="log-in">البريد الالكتروني:</label>
                    <input
                      className="inputDispalyBlock"
                      type="email"
                      name="email"
                      placeholder="البريد الالكتروني للمنظمة"
                      value={organization.email}
                      onChange={handleOrganizationChange}
                      required
                    />
                    <label className="log-in">كلمة السر:</label>
                    <input
                      className="inputDispalyBlock"
                      type="password"
                      name="password"
                      placeholder="كلمة السر"
                      value={organization.password}
                      onChange={handleOrganizationChange}
                      required
                    />
                    <button type="submit" className="login-button">
                      {isLoading ? <div className="loader"></div> : 'تسجيل الدخول'}
                    </button>
                  </form>
                )}
                <button 
                  onClick={() => setShowForgotPassword(true)}
                  className="forgot-password-link"
                >
                  نسيت كلمة المرور؟
                </button>
              </>
            ) : (
              <form onSubmit={handleForgetPassword}>
                <label className="log-in">البريد الالكتروني:</label>
                <input
                  className="inputDispalyBlock"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
                {resetMessage && <p className={resetMessage.includes('تم') ? 'success-message' : 'error-message'}>{resetMessage}</p>}
                <button type="submit" className="login-button">
                  {isLoading ? <div className="loader"></div> : 'إرسال رمز التحقق'}
                </button>
                <button 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage('');
                    setResetEmail('');
                  }}
                  className="back-to-login"
                >
                  العودة لتسجيل الدخول
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;