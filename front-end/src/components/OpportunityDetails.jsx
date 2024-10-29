import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./OpportunityDetails.css";

const OpportunityDetails = ({ opportunity, onClose }) => {
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, pending, accepted, rejected
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirmation modal state
  const [showFeedback, setShowFeedback] = useState(false); // Feedback message state

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

  // Handle Request Participation
  const handleRequestParticipation = async () => {
    setShowConfirmModal(false); // Close confirmation modal
    try {
      await axios.post(`http://localhost:5000/volunteer/request/${opportunity._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setRequestStatus('pending'); // Set status to pending
      setShowFeedback(true); // Show feedback message
      setTimeout(() => setShowFeedback(false), 5000); // Hide feedback after 3 seconds
    } catch (error) {
      console.error('Error sending participation request:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <div className='mdry'>
          <h1>{"       "+opportunity.title}</h1>
          <img 
            src={`http://localhost:5000/uploads/${opportunity.image}`} 
            alt={opportunity.title} 
            className="opportunity-image"
          />
          <p id="description">{opportunity.description}</p>
          <div id="details-info">
            <p><h3>: تاريخ البداية</h3>{new Date(opportunity.date).toLocaleDateString()}</p> 
            <p><h3>📍: الموقع</h3>{opportunity.location}</p>
            <p><h3>: العدد المطلوب</h3>{opportunity.participantsNeeded}</p>
            <p><h3>: المدة</h3>{opportunity.duration}h</p>
          </div>
        </div>
        
        {/* Request Participation Button */}
        {requestStatus === 'idle' ? (
          <button 
            onClick={() => setShowConfirmModal(true)} 
            className="participation-button"
          >
            طلب المشاركة
          </button>
        ) : (
          <button className="participation-button pending" disabled>
            {requestStatus === 'pending' ? 'معلّق' : requestStatus === 'accepted' ? 'مقبول' : 'مرفوض'}
          </button>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="confirm-modal">
            <div className="confirm-modal-content">
              <p>هل أنت متأكد من طلب المشاركة؟</p>
              <button className="confirm-button" onClick={handleRequestParticipation}>
                متأكد
              </button>
              <button className="cancel-button" onClick={() => setShowConfirmModal(false)}>
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Feedback Message */}
        {showFeedback && (
          <div className="feedback-message">
            تم إرسال الطلب بنجاح!
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetails;
