import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderV from "./HeaderV";
import OpportunityDetails from './OpportunityDetails'; // Import the modal component
import './VolunteerHomepage.css'; // Styles for the homepage and modal

const VolunteerHomepage = ({ user, handleLogout }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null); // State for the selected opportunity
  const [showModal, setShowModal] = useState(false); // State for modal visibility

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

  return (
    <div>
      <HeaderV name={user.name} handleLogout={handleLogout} />
      <div className="main-section">
        <h1 className="page-title">فرص تطوعية</h1> {/* Title for volunteer opportunities */}

        <div className="opportunities-container">
          {opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <div 
                key={opp._id} 
                className="opportunity-card" 
                onClick={() => handleCardClick(opp)} // Set the opportunity and show modal
              >
                <img 
                  src={`http://localhost:5000/uploads/${opp.image}`} 
                  alt={opp.title} 
                  className="opportunity-image"
                />
                <h3 className="opportunity-title">{opp.title}</h3> {/* Display the title */}
                <p className="opportunity-date">{new Date(opp.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No opportunities found.</p>
          )}
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
