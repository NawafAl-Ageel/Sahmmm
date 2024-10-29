import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderV from "./HeaderV";
import OpportunityDetails from './OpportunityDetails'; // Import the modal component
import './VolunteerHomepage.css'; // Styles for the homepage and modal

const VolunteerHomepage = ({ user, handleLogout }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null); // State for the selected opportunity
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filter, setFilter] = useState('all'); // State for filter dropdown
  const [date, setDate] = useState(''); // State for date input

  useEffect(() => {
    // Fetch all opportunities when the component loads
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/opportunities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Use the stored token
          },
        });
        setOpportunities(response.data); // Set fetched opportunities to state
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, []);

  // Handle card click to open the modal
  const handleCardClick = (opportunity) => {
    setSelectedOpportunity(opportunity); // Set the clicked opportunity
    setShowModal(true); // Show the modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOpportunity(null); // Reset the selected opportunity
  };

  // Filter and search opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || opp.type === filter;
    const matchesDate = !date || new Date(opp.date).toLocaleDateString() === date;

    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <div>
      <HeaderV name={user.name} handleLogout={handleLogout} />
      <div className="main-section">
        <div className="homepage-container"> {/* Add this container */}
          {/* Search, Filter, and Date Controls */}
          <div className="search-filter-container">
            <input
              type="text"
              placeholder="ابحث"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="date-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-dropdown"
            >
              <option value="all">الكل</option>
              <option value="program">بيئية</option>
              <option value="workshop">صحية</option>
              <option value="meetup">تنظيمية</option>
              <option value="webinar">اجتماعية</option>
              <option value="education">تعليمية</option>
              <option value="recreational">ترفيهية</option>
              <option value="sports">رياضية</option>
              <option value="relief">إغاثية</option>
            </select>
          </div>

          {/* Opportunities Container */}
          <div className="opportunities-container">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp) => {
                const isFutureDate = new Date(opp.date) > new Date(); // Check if the date is in the future
                const hasVacancy = opp.participantsNeeded > opp.currentParticipants; // Check if spots are available

                return (
                  <div key={opp._id} className="opportunity-card" onClick={() => handleCardClick(opp)}>
                    <img 
                      src={`http://localhost:5000/uploads/${opp.image}`} 
                      alt={opp.title} 
                      className="opportunity-image"
                    />

                    {/* Conditional Category and Registration Status */}
                    <div className="opportunity-header">
                      {isFutureDate && hasVacancy ? (
                        <span className="status-label available">متاح التسجيل</span>
                      ) : (
                        <span className="status-label unavailable">مغلق للتسجيل</span>
                      )}
                    </div>

                    {/* Opportunity Title */}
                    <h3 className="opportunity-title">{opp.title}</h3>

                    {/* Opportunity Footer */}
                    <div className="opportunity-footer">
                      <div className="date">
                        <span className="icon">📅</span>
                        <span>{new Date(opp.date).toLocaleDateString()}</span>
                      </div>
                      <div className="duration">
                        <span className="icon">⏱</span>
                        <span>مدة {opp.duration} ساعات</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-opportunities">لا توجد فرص حالية</p>
            )}
          </div>
        </div>

        {/* Render the OpportunityDetails modal if showModal is true */}
        {showModal && (
          <OpportunityDetails 
            opportunity={selectedOpportunity} 
            onClose={handleCloseModal} 
          />
        )}
      </div>
    </div>
  );
};

export default VolunteerHomepage;
