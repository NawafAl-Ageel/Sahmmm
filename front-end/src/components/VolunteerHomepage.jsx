import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderV from "./HeaderV";
import OpportunityDetails from './OpportunityDetails'; // Import the modal component
import './VolunteerHomepage.css'; // Styles for the homepage and modal

const VolunteerHomepage = ({ user, handleLogout }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/opportunities', {
          params: { category: filter === 'all' ? '' : filter },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, [filter]); // Add filter as a dependency

  const handleCardClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOpportunity(null);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || opp.category === filter; // Updated this line
    const matchesDate = !date || new Date(opp.date) >= new Date(date);

    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <div>
  <HeaderV name={user.name} handleLogout={handleLogout} />
  <div className="main-section">
    <div className="homepage-container">
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="ابحث"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Date Filter with Label */}
        <div className="date-filter-container">
          <label htmlFor="fromDate" className="filter-label">التصفية من هذا التاريخ</label>
          <input
            type="date"
            id="fromDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />
        </div>

        {/* Category Filter with Label */}
        <div className="category-filter-container">
          <label htmlFor="category" className="filter-label">التصفية حسب الفئة</label>
          <select
            id="category"
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
      </div>


          <div className="opportunities-container">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp) => {
                const isFutureDate = new Date(opp.date) > new Date();
                const hasVacancy = opp.participantsNeeded > opp.currentParticipants;

                return (
                  <div key={opp._id} className="opportunity-card" onClick={() => handleCardClick(opp)}>
                    <img 
                      src={`http://localhost:5000/uploads/${opp.image}`} 
                      alt={opp.title} 
                      className="opportunity-image"
                    />

                    <div className="opportunity-header">
                      {isFutureDate  ? (
                        <span className="status-label available">متاح التسجيل</span>
                      ) : (
                        <span className="status-label unavailable">مغلق للتسجيل</span>
                      )}
                    </div>

                    <h3 className="opportunity-title">{opp.title}</h3>

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
