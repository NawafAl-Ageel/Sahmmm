import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './History.css';
import HeaderV from './HeaderV';

const History = ({ user, handleLogout }) => {
  const [participationHistory, setParticipationHistory] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [selectedRating, setSelectedRating] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const profileResponse = await axios.get('http://localhost:5000/volunteerprofile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(profileResponse.data);

        const historyResponse = await axios.get('http://localhost:5000/volunteer/participation-history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParticipationHistory(historyResponse.data);
      } catch (error) {
        console.error('Error fetching profile or participation history:', error.response?.data || error.message);
      }
    };

    fetchProfileAndHistory();
  }, []);

  const handleRating = async (opportunityId, rating) => {
    console.log('Rating submitted for opportunity'); // Debug log
    console.log('Opportunity ID:', opportunityId); // Debug log
    console.log('Rating:', rating); // Debug log
  
    try {
      const token = localStorage.getItem('authToken');
  
      const response = await axios.post(
        `http://localhost:5000/api/opportunities/rate/${opportunityId}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update local state with the new average rating
      setParticipationHistory((prevHistory) =>
        prevHistory.map((history) =>
          history.opportunity._id === opportunityId
            ? { ...history, opportunity: { ...history.opportunity, avgRating: response.data.avgRating } }
            : history
        )
      );
  
      alert('تم إرسال التقييم بنجاح!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('فشل في إرسال التقييم. الرجاء المحاولة لاحقًا.');
    }
  };

  const goBackToProfile = () => {
    navigate('/volunteerprofile'); // Navigate back to the profile page
  };

  return (
    <div>
      <HeaderV name={user.name} handleLogout={handleLogout} />
      <div className="main-section">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-sidebar">
              <img
                src={`http://localhost:5000${profileData.profilePicture || '/images/default-profile.png'}`}
                alt="Profile"
                className="profile-picture"
              />
              <h2 className="profile-name">{profileData.name || 'اسم المتطوع'}</h2>
              <p className="profile-title">مساهم</p>

              <div className="profile-stats">
                <p>
                  المساهمات السابقة:{' '}
                  <span className="stat-number">
                    {profileData.opportunitiesParticipated || 0}
                  </span>
                </p>
                <p>
                  المساهمات الحالية:{' '}
                  <span className="stat-number">
                    {profileData.currentOpportunities || 0}
                  </span>
                </p>
              </div>
            </div>

            <div className="history-details">
              <h3>المساهمات السابقة</h3>
              <div className="history-mini-cards">
                {participationHistory.map((history, index) => (
                  <div key={index} className="mini-card">
                    <img
                      src={`http://localhost:5000/uploads/${history.opportunity.image || 'default-image.jpg'}`}
                      alt={history.opportunity.title}
                      className="mini-card-image"
                    />
                    <div className="mini-card-content">
                      <h4>{history.opportunity.title}</h4>
                      <p>{new Date(history.opportunity.date).toLocaleDateString()}</p>

                      {/* Star Rating */}
                      <div className="star-rating">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`star ${selectedRating[history.opportunity._id] >= star ? 'selected' : ''}`}
      onMouseEnter={() =>
        setSelectedRating((prev) => ({ ...prev, [history.opportunity._id]: star }))
      }
      onMouseLeave={() =>
        setSelectedRating((prev) => ({ ...prev, [history.opportunity._id]: history.opportunity.avgRating || 0 }))
      }
      onClick={() => handleRating(history.opportunity._id, star)}
    >
      ★
    </span>
  ))}
</div>
                      <p>التقييم الحالي: {history.opportunity.avgRating?.toFixed(1) || 'غير متوفر'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="profile-buttons">
                <button onClick={goBackToProfile} className="back-button">
                  العودة للحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
