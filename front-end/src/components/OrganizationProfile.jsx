import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderO from './HeaderO';

const OrganizationProfile = ({ user, setUser, setOrganizationToken, handleLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/organization-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching organization profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.delete('http://localhost:5000/deleteorganization', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setOrganizationToken(null);
          setUser(null);
          localStorage.removeItem('authToken');
          console.log('Account deleted successfully');
          navigate('/signUp');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    
    <div>
      <HeaderO name={user.name} handleLogout={handleLogout} />
      <h2>Organization Profile</h2>
      <p><strong>Name:</strong> {profileData.name}</p>
      <p><strong>Email:</strong> {profileData.email}</p>
      <p><strong>City:</strong> {profileData.city || 'Not specified'}</p>

      <button onClick={deleteAccount}>Delete Account</button>
    </div>
  );
};

export default OrganizationProfile;
