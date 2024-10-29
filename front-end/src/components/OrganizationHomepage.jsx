import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderO from "./HeaderO";
import './OrganizationHomePage.css'; // Your custom styles
import OrganizationRequests from './OrganizationRequests'; // Import the OrganizationRequests component

const OrganizationHomePage = ({ user, handleLogout }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Fetch opportunities when the component loads
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/organization/opportunities', {
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

  // Function to toggle requests modal visibility
  const toggleRequestsModal = () => {
    setShowRequestsModal(!showRequestsModal); // Toggle between true and false
  };

  return (
    <div>
      <HeaderO 
        name={user.name} 
        handleLogout={handleLogout} 
        onRequestsClick={toggleRequestsModal} // Pass the toggle function to header
      />
      <div className="main-section">
        <h1 className="page-title">فرص المنظمة</h1> 

        <div className="opportunities-container">
          {opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <div key={opp._id} className="opportunity-card">
                <img 
                  src={`http://localhost:5000/uploads/${opp.image}`} 
                  alt={opp.title} 
                  className="opportunity-image"
                />
                <h3 className="opportunity-title">{opp.title}</h3>
                <p className="opportunity-date">{new Date(opp.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No opportunities found.</p>
          )}
        </div>
      </div>

      {/* Modal for Volunteer Requests */}
      {showRequestsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={toggleRequestsModal}>X</button>
            <OrganizationRequests user={user} /> {/* Include OrganizationRequests inside the modal */}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationHomePage;
