import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';
import HeaderV from './HeaderV';
import axios from 'axios';

function History({ user, handleLogout }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [message, setMessage] = useState('');
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);

  const goBackToProfile = () => {
    navigate('/volunteerprofile');
  };

  // Fetch opportunities with ratings
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/opportunities', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    // Get the current userId
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Fetch the ratings for the current user from localStorage
      const savedRatings = JSON.parse(localStorage.getItem(`userRatings_${userId}`)) || {};
      setUserRatings(savedRatings);
    }

    fetchOpportunities();
  }, []); // Runs when the component mounts

  const handleRatingSubmit = (rating, eventId) => {
    const userId = localStorage.getItem('userId');
    const newRatings = { ...userRatings, [eventId]: rating };
    setUserRatings(newRatings);
    localStorage.setItem(`userRatings_${userId}`, JSON.stringify(newRatings));

    axios
      .post(
        'http://localhost:5000/ratings',
        { ratingValue: rating, opportunityId: eventId, volunteerId: userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      )
      .then(() => {
        setMessage('تم إضافة التقييم بنجاح');
        setShowModal(false);
        setShowFeedbackMessage(true);

        setTimeout(() => {
          setShowFeedbackMessage(false);
          resetRatingState();
        }, 3000);
      })
      .catch((error) => {
        setMessage(`حدث خطأ أثناء إضافة التقييم: ${error.response?.data?.message || error.message}`);
      });
  };

  const resetRatingState = () => {
    setSelectedRating(0);
    setCurrentEventId(null);
    setMessage('');
  };

  const openModal = (eventId) => {
    setShowModal(true);
    setCurrentEventId(eventId);
    setMessage('');
  };

  if (loading) {
    return <div className="loading-spinner">جارٍ تحميل الفرص...</div>;
  }

  return (
    <div>
      <HeaderV name={user.name} handleLogout={handleLogout} />
      <div className="main-section">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-sidebar">
              <img src="images/profile-picture.jpg" alt="Profile" className="profile-picture" />
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-title">مساهم</p>
              <div className="profile-stats">
                <p>الفرص المشاركة: <span className="stat-number">12</span></p>
                <p>الفرص الحالية: <span className="stat-number">3</span></p>
              </div>
              <button className="public-profile-btn">عرض الملف العام</button>
            </div>

            <div className="history-details">
              <h3>فرص المساهمة التطوعية</h3>
              <div className="history-mini-cards">
                {history.map((event) => (
                  <div key={event._id} className="mini-card">
                    <div className="mini-card-content">
                      <h4>{event.title}</h4>
                      <p>{(event.date).split("T")[0]}</p>
                      <div className="rating">
                        <p>
                          متوسط التقييم: {event.avgRating ? event.avgRating.toFixed(1) : 'غير متوفر'} / 5 ⭐
                        </p>
                        {/* {userRatings[event._id] && (
                          <p>تقييمك الحالي: {userRatings[event._id]} / 5 ⭐</p>
                        )} */}
                        <button
                          style={{ width: '100px', fontSize: '11px', height: '50px' }}
                          onClick={() => openModal(event._id)}
                        >
                          قيّم هذه الفرصة
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="profile-buttons">
                <button onClick={goBackToProfile} className="back-button">العودة للملف الشخصي</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content-ret">
            <span className="close-ret" onClick={() => setShowModal(false)}>&times;</span>
            <h3>اختر التقييم (من 1 إلى 5)</h3>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${selectedRating >= star ? 'selected' : ''}`}
                  onClick={() => setSelectedRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                if (selectedRating >= 1 && selectedRating <= 5) {
                  handleRatingSubmit(selectedRating, currentEventId);
                } else {
                  setMessage('يرجى اختيار تقييم بين 1 و 5.');
                }
              }}
            >
              إرسال التقييم
            </button>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}

      {showFeedbackMessage && (
        <div className="feedback-message">تم التقييم بنجاح!</div>
      )}
    </div>
  );
}

export default History;
