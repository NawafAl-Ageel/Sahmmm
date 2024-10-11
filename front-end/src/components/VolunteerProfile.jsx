import { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import './ProjectStyle.css';
import { useNavigate } from 'react-router-dom';
import HeaderV from './HeaderV';

const VolunteerProfile = ({ user, setUser, setVolunteerToken, handleLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCity, setUpdatedCity] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // For storing the selected profile picture
  const [previewImage, setPreviewImage] = useState(null); // For storing the preview of the selected file
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/volunteerprofile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(response.data);
        setUpdatedCity(response.data.city || '');
      } catch (error) {
        console.error('Error fetching volunteer profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token being sent:', token);

        const response = await axios.delete('http://localhost:5000/deletevolunteer', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setVolunteerToken(null);
          setUser(null);
          localStorage.removeItem('authToken');
          console.log('Account deleted successfully');
          navigate('/home');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
      }
    }
  };

  if (!profileData) return <div>Loading...</div>;

  // Helper function to format the birthday date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return 'Not specified';
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  };

  // Function to handle editing state
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Function to handle saving the updated city of residence
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        'http://localhost:5000/volunteerprofile',
        { city: updatedCity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData((prevData) => ({
        ...prevData,
        city: updatedCity,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving updated profile:', error);
    }
  };

  // Function to handle file selection for profile picture
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Set preview to the selected file
    }
  };

  // Function to handle profile picture upload
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        'http://localhost:5000/volunteerprofile/picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update profile data with the new profile picture URL from server response
      setProfileData(response.data);
      setSelectedFile(null);
      setPreviewImage(null); // Reset the preview after successful upload
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div>
      <HeaderV name={user.name} handleLogout={handleLogout} />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-sidebar">
            <div
              className="profile-picture-container"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <img
                src={`http://localhost:5000${profileData.profilePicture || '/images/default-profile.png'}`}
                alt="Profile"
                className="profile-picture"
              />
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <button onClick={handleFileUpload} className="upload-button">
                Upload Picture
              </button>
            )}
            <h2 className="profile-name">{profileData.name}</h2>
            <p className="profile-title">Volunteer</p>

            <div className="profile-stats">
              <p>
                Opportunities Participated:{' '}
                <span className="stat-number">
                  {profileData.opportunitiesParticipated || 0}
                </span>
              </p>
              <p>
                Current Opportunities:{' '}
                <span className="stat-number">
                  {profileData.currentOpportunities || 0}
                </span>
              </p>
            </div>

            <button className="public-profile-btn">View Public Profile</button>
          </div>

          <div className="profile-details">
            <h3>Account Information</h3>
            <br></br>

            <div className="profile-info">
              <div className="profile-info-item">
                <label>Email</label>
                <p>{profileData.email}</p>
              </div>
              <div className="profile-info-item">
                <label>City of Residence</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedCity}
                    onChange={(e) => setUpdatedCity(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{profileData.city || 'Not specified'}</p>
                )}
              </div>
              <div className="profile-info-item">
                <label>Date of Birth</label>
                <p>
                  {profileData.birthday ? formatDate(profileData.birthday) : 'Not specified'}
                </p>
              </div>
              <div className="profile-info-item">
                <label>Age</label>
                <p>
                  {profileData.birthday ? calculateAge(profileData.birthday) : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="profile-buttons">
              {isEditing ? (
                <button onClick={handleSaveProfile} className="edit-button">
                  Save
                </button>
              ) : (
                <button onClick={handleEditProfile} className="edit-button">
                  Edit Profile
                </button>
              )}
              <button onClick={() => navigate('/history')} className="history-button">
                View History
              </button>

              <button onClick={deleteAccount} id='Delete' className="history-button">Delete user</button>

              <button onClick={() => navigate('/home')} className="back-button">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
