import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./OpportunityDetails.css";

const OpportunityDetails = ({ opportunity, onClose }) => {
  const [requestStatus, setRequestStatus] = useState('idle');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/volunteer/request-status/${opportunity._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        setRequestStatus(response.data.status || 'idle'); // Ensure status is valid
      } catch (error) {
        console.error('Error fetching request status:', error);
        setRequestStatus('idle'); // Default to 'idle' on error
      }
    };

    fetchRequestStatus();
  }, [opportunity._id]);

  const handleRequestParticipation = async () => {
    setShowConfirmModal(false);
    try {
      await axios.post(
        `http://localhost:5000/volunteer/request/${opportunity._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setRequestStatus('pending');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 5000);
    } catch (error) {
      console.error('Error sending participation request:', error);
    }
  };

  const handleDownload = (filePath) => {
    window.open(`http://localhost:5000/${filePath}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h1>{opportunity.title}</h1>

        <img 
          src={`http://localhost:5000/uploads/${opportunity.image}`} 
          alt={opportunity.title} 
          className="opportunity-imagee"
        />

        <div className="custom-table-description-container">
          <div className="custom-table">
            <div className="table-section">
              <h3 className="section-title">التاريخ</h3>
              <div className="table-row">        
                <div className="table-cell">
                  <p>تاريخ البداية</p>
                  <p className="cell-value">{new Date(opportunity.date).toLocaleDateString("en-CA")}</p>
                </div>
              </div>
            </div>

          

            {requestStatus === 'idle' ? (
              <button 
                onClick={() => setShowConfirmModal(true)} 
                className="participation-button"
              >
                طلب المشاركة
              </button>
            ) : (
              <button className={`participation-button ${requestStatus}`} disabled>
                {requestStatus === 'pending' 
                  ? 'معلّق' 
                  : requestStatus === 'accepted' 
                  ? 'مقبول' 
                  : 'مرفوض'}
              </button>
            )}

<div className="average-rating">
  <p>⭐التقييم الحالي: {opportunity.avgRating?.toFixed(1) +"/5"|| 'غير متوفر'}</p>
</div>

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

            {showFeedback && (
              <div className="feedback-message">
                تم إرسال الطلب بنجاح!
              </div>
            )}

            <div className="table-footer">
              <p>{opportunity.duration} ساعات</p>
              <p>📍 {opportunity.location}</p>
            </div>
          </div>

          <div id="description-goals-container">
            <div className="description-section">
              <p className="description-title"><strong>: الوصف</strong></p>
              <p id="description">{opportunity.description}</p>
              <hr className="section-divider" />
            </div>
          </div>
        </div>

        {opportunity.files && opportunity.files.length > 0 && (
          <div className="download-section">
            <h3>ملفات ذات صلة</h3>
            {opportunity.files.map((file, index) => (
              <button
                key={index}
                className="download-button"
                onClick={() => handleDownload(file.filePath)}
              >
                تحميل {file.fileName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetails;
