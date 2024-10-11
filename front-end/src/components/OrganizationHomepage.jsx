import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderO from "./HeaderO";
import './OrganizationHomePage.css'; // Create this for custom styles

const OrganizationHomePage = ({ user, handleLogout }) => {
  const [opportunities, setOpportunities] = useState([]);

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

  return (
    <div>
      <HeaderO name={user.name} handleLogout={handleLogout} />
      <div className="main-section">
        <h1 className="page-title">فرص المنظمة</h1> 

        <div className="opportunities-container">
          {opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <div key={opp._id} className="opportunity-card" onClick={() => window.location.href = `/opportunity/${opp._id}`}>
                <img 
                  src={`http://localhost:5000/uploads/${opp.image}`} 
                  alt={opp.title} 
                  className="opportunity-image"
                />
                <h3 className="opportunity-title">{opp.title}</h3> {/* Included title */}
                <p className="opportunity-date">{new Date(opp.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No opportunities found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationHomePage;
