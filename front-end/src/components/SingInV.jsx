import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./ProjectStyle.css";

const SignInV = ({ setVolunteerToken, setUser }) => {
  const [volunteer, setVolunteer] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setVolunteer((prev) => ({ ...prev, [name]: value }));
  };

  const handleVolunteerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/singin-volunteer',{

       ...volunteer,
       role :'volunteer',
      });
      console.log('Volunteer logged in:', response.data);
      // حفظ التوكن في الحالة والانتقال إلى الصفحة المناسبة
      localStorage.setItem('authToken', response.data.token); // تخزين التوكن في localStorage
      setVolunteerToken(response.data.token);
      setUser(response.data.user);
      navigate('/volunteerhome'); // الانتقال إلى الصفحة الرئيسية للمتطوع
    } catch (error) {
      console.error('Error logging in volunteer:', error.response.data);
    }
  };
  

  return (
    <form onSubmit={handleVolunteerLogin}>
      <label>Email: </label>
      <input
        className="inputDispalyBlock"
        type="email"
        name="email"
        value={volunteer.email}
        onChange={handleVolunteerChange}
        placeholder="Example@gmail.com"
        required
      />
      <label>Password: </label>
      <input
        className="inputDispalyBlock"
        type="password"
        name="password"
        value={volunteer.password}
        onChange={handleVolunteerChange}
        placeholder="Password"
        required
      />

      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

      <br />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignInV;
