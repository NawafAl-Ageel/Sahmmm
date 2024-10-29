import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./OpportunityDetails.css";

const OpportunityDetails = ({ opportunity, onClose }) => {
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, pending, accepted, rejected
  
  // Fetch the request status when the component loads
  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/volunteer/request-status/${opportunity._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setRequestStatus(response.data.status); // Update the request status from the server
      } catch (error) {
        console.error('Error fetching request status:', error);
      }
    };

    fetchRequestStatus();
  }, [opportunity._id]);

  const handleRequestParticipation = async () => {
    try {
      await axios.post(`http://localhost:5000/volunteer/request/${opportunity._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setRequestStatus('pending'); // Change button to "Pending" after request
    } catch (error) {
      console.error('Error sending participation request:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h1>{opportunity.title}</h1>
        <img 
          src={`http://localhost:5000/uploads/${opportunity.image}`} 
          alt={opportunity.title} 
          className="opportunity-image"
        />
        <p id="description">{opportunity.description}</p>
        <br></br>
        <div id="details-info">
          <p> {new Date(opportunity.date).toLocaleDateString()}<h3>: تاريخ البداية</h3></p> 
          <p> {opportunity.location}<h3>📍: الموقع</h3></p>
          <p>{opportunity.participantsNeeded}<h3>: العدد المطلوب </h3></p>
          <p> {opportunity.duration}h <h3> :المدة   </h3></p>
        </div>
        
        {/* Button to Request Participation */}
        {requestStatus === 'idle' ? (
          <button onClick={handleRequestParticipation} className="participation-button">
            طلب المشاركة
          </button>
        ) : (
          <button className="participation-button pending" disabled>
            {requestStatus === 'pending' ? 'Pending' : requestStatus === 'accepted' ? 'Accepted' : 'Rejected'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetails;
