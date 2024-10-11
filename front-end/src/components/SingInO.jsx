import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInO = ({ setOrganizationToken, setUser }) => {
  const [organization, setOrganization] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // استخدام useNavigate للتوجيه


  const handleOrganizationChange = (e) => {
    const { name, value } = e.target;
    setOrganization((prev) => ({ ...prev, [name]: value }));
  };


  const handleOrganizationLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/singin-organization', {
        ...organization,
        role: 'organization',
      });
      console.log('Organization logged in:', response.data);
      // حفظ التوكن في الحالة والانتقال إلى الصفحة المناسبة
      localStorage.setItem('authToken', response.data.token); // تخزين التوكن في localStorage
      setOrganizationToken(response.data.token);
      setUser(response.data.user);
      navigate('/organizationhome'); // الانتقال إلى الصفحة الرئيسية للمنظمة
    } catch (error) {
      console.error('Error logging in organization:', error.response.data);
    }
  };

  return (
          <form onSubmit={handleOrganizationLogin}>
            <label>Email: </label>
            <input
              className="inputDispalyBlock"
              type="email"
              name="email"
              value={organization.email}
              onChange={handleOrganizationChange}
              placeholder="Example@gmail.com"
              required
            />
            <label>Password: </label>
            <input
              className="inputDispalyBlock"
              type="password"
              name="password"
              value={organization.password}
              onChange={handleOrganizationChange}
              placeholder="Password"
              required
            />
            

              
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <br />
            <button type="submit">Sing Iin</button>
          </form>
  );
};

export default SignInO;
