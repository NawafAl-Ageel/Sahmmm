import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderO from "./HeaderO";
import './OrganizationHomePage.css';

// Sidebar components
import OrganizationInfo from './OrganizationLeftSideBar/OrganizationInfo';
import AllOpportunities from './OrganizationLeftSideBar/AllOpportunities';
import EditDeleteOpportunities from './OrganizationLeftSideBar/EditDeleteOpportunities';
import VolunteersManagement from './OrganizationLeftSideBar/VolunteersManagement';
import Reports from './OrganizationLeftSideBar/Reports';
import OrganizationRequests from './OrganizationRequests';

const OrganizationHomePage = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('info'); // Default to 'info'
  const [opportunities, setOpportunities] = useState([]); // Initialize state for opportunities
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch opportunities when component mounts
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/organization/opportunities', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setOpportunities(response.data); // Update state with fetched opportunities
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setError('Failed to fetch opportunities. Please try again later.');
      setIsLoading(false);
    }
  };

  // Toggle requests modal
  const toggleRequestsModal = () => {
    setShowRequestsModal(!showRequestsModal);
  };

  return (
    <div className="organization-homepage">
      <HeaderO 
        name={user.name} 
        handleLogout={handleLogout} 
        onRequestsClick={toggleRequestsModal}
      />
      <div className="sidebar-main-container">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            <li 
              className={activeTab === 'info' ? 'active' : ''} 
              onClick={() => setActiveTab('info')}
            >
              معلوماتنا
            </li>
            <li 
              className={activeTab === 'opportunities' ? 'active' : ''} 
              onClick={() => setActiveTab('opportunities')}
            >
              فرصنا
            </li>
            <li 
              className={activeTab === 'edit-delete' ? 'active' : ''} 
              onClick={() => setActiveTab('edit-delete')}
            >
              تعديل وحذف الفرص
            </li>
            <li 
              className={activeTab === 'volunteers' ? 'active' : ''} 
              onClick={() => setActiveTab('volunteers')}
            >
              المساهمين
            </li>
            <li 
              className={activeTab === 'reports' ? 'active' : ''} 
              onClick={() => setActiveTab('reports')}
            >
              التقارير
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {activeTab === 'info' && <OrganizationInfo />}
          {activeTab === 'opportunities' && <AllOpportunities opportunities={opportunities} />}
          {activeTab === 'edit-delete' && (
            <EditDeleteOpportunities 
              opportunities={opportunities}
              setOpportunities={setOpportunities}
            />
          )}
          {activeTab === 'volunteers' && <VolunteersManagement />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </div>

      {showRequestsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={toggleRequestsModal}>X</button>
            <OrganizationRequests user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationHomePage;
