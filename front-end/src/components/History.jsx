import { useNavigate } from 'react-router-dom';
import './History.css';
import HeaderV from './HeaderV';

function History(user, handleLogout) {
  const navigate = useNavigate();

  const goBackToProfile = () => {
    navigate('/volunteerprofile'); // Navigate back to profile page
  };

  // Sample data for volunteer opportunities (mini cards)
  const volunteerHistory = [
    {
      title: 'العناية بالمساجد',
      date: 'July 15, 2021',
      description: 'تنظيف فرش 3 مساحد في الرياض.',
      image: 'images/masjid.jpg', // Replace with real image
    },
    {
      title: 'إفطار صائم',
      date: 'December 22, 2022',
      description: 'توزيع وجبات إفطار في الشهر المبارك',
      image: 'images/iftar.jpeg', // Replace with real image
    },
    {
      title: 'تمريض',
      date: 'April 10, 2019',
      description: 'تمريض في مستشفى الحبيب.',
      image: 'images/tamrith.png', // Replace with real image
    },
    {
      title: 'زراعة البان العربي',
      date: 'March 5, 2022',
      description: 'زرع بذور البان العربي.',
      image: 'images/zraa.jpeg', // Replace with real image
    },
  ];

  return (
    <div>
      <HeaderV name={user.name} handleLogout={handleLogout} />
    
    <div className='main-section'>
    <div className="profile-container">
      <div className="profile-card">
        {/* Left Section (Profile Sidebar) */}
        <div className="profile-sidebar">
          <img src="images/profile-picture.jpg" alt="Profile" className="profile-picture" />
          <h2 className="profile-name">Nawaf Alageel</h2>
          <p className="profile-title">Volunteer</p>

          <div className="profile-stats">
            <p>Opportunities Participated: <span className="stat-number">12</span></p>
            <p>Current Opportunities: <span className="stat-number">3</span></p>
          </div>

          <button className="public-profile-btn">View Public Profile</button>
        </div>

        {/* Right Section (Volunteer History) */}
        <div className="history-details">
          <h3>Volunteer Opportunities</h3>

          {/* Scrollable container for mini cards */}
          <div className="history-mini-cards">
            {volunteerHistory.map((event, index) => (
              <div key={index} className="mini-card">
                <img src={event.image} alt={event.title} className="mini-card-image" />
                <div className="mini-card-content">
                  <h4>{event.title}</h4>
                  <p>{event.date}</p>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-buttons">
            <button onClick={goBackToProfile} className="back-button">Back to Profile</button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default History;
