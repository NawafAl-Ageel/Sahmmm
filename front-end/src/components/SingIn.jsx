import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // Assuming you have a Header component
import { Link } from 'react-router-dom';

const SignIn = ({ setVolunteerToken, setOrganizationToken, setUser }) => {
  const [role, setRole] = useState('volunteer'); // Default to volunteer
  const [volunteer, setVolunteer] = useState({ email: '', password: '' });
  const [organization, setOrganization] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // حالة لتخزين رسالة الخطأ
  const navigate = useNavigate();

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setVolunteer((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrganizationChange = (e) => {
    const { name, value } = e.target;
    setOrganization((prev) => ({ ...prev, [name]: value }));
  };

  const handleVolunteerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/singin-volunteer', {
        ...volunteer,
        role: 'volunteer',
      });
      localStorage.setItem('authToken', response.data.token);
      setVolunteerToken(response.data.token);
      setUser(response.data.user);
      navigate('/volunteerhome');
      setError(''); // مسح رسالة الخطأ إذا تم تسجيل الدخول بنجاح
    } catch (error) {
      setError('خطأ في تسجيل الدخول للمساهم: الرجاء التحقق من البريد الإلكتروني وكلمة المرور'); // تعيين رسالة الخطأ
      console.error('Error logging in volunteer:', error.response.data);
    }
  };

  const handleOrganizationLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/singin-organization', {
        ...organization,
        role: 'organization',
      });
      localStorage.setItem('authToken', response.data.token);
      setOrganizationToken(response.data.token);
      setUser(response.data.user);
      navigate('/organizationhome');
      setError(''); // مسح رسالة الخطأ إذا تم تسجيل الدخول بنجاح
    } catch (error) {
      setError('خطأ في تسجيل الدخول للمنظمة: الرجاء التحقق من البريد الإلكتروني وكلمة المرور'); // تعيين رسالة الخطأ
      console.error('Error logging in organization:', error.response.data);
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
              <label className="radio-inline" htmlFor="volunteer">مساهم
                <input
                  className="radio-group"
                  type="radio"
                  name="role"
                  value="volunteer"
                  checked={role === 'volunteer'}
                  onChange={() => setRole('volunteer')}
                />
              </label>
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
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* عرض رسالة الخطأ هنا */}
            {role === 'volunteer' ? (
              <form onSubmit={handleVolunteerLogin}>
                <input
                  className="inputDispalyBlock"
                  type="email"
                  name="email"
                  placeholder="البريد الالكتروني للمساهم"
                  value={volunteer.email}
                  onChange={handleVolunteerChange}
                  required
                />
                <input
                  className="inputDispalyBlock"
                  type="password"
                  name="password"
                  placeholder="كلمة السر"
                  value={volunteer.password}
                  onChange={handleVolunteerChange}
                  required
                />
                <button type="submit">تسجيل الدخول</button>
              </form>
            ) : (
              <form onSubmit={handleOrganizationLogin}>
                <input
                  className="inputDispalyBlock"
                  type="email"
                  name="email"
                  placeholder="البريد الالكتروني للمنظمة"
                  value={organization.email}
                  onChange={handleOrganizationChange}
                  required
                />
                <input
                  className="inputDispalyBlock"
                  type="password"
                  name="password"
                  placeholder="كلمة السر"
                  value={organization.password}
                  onChange={handleOrganizationChange}
                  required
                />
                
                <button type="submit">تسجيل الدخول</button>
              </form>
            )}

           
            <br />
            <Link className='AccountSwitch' to="/singup">ليس لديك حساب ؟</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
