import React from 'react';
import './VolunteerProfileModal.css'; // Add your CSS styles for the modal

const VolunteerProfileModal = ({ volunteer, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content1">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>حساب المساهم</h2>
        <img
          src={`http://localhost:5000${volunteer.profilePicture || '/images/default-profile.png'}`}
          alt={volunteer.name}
          className="volunteer-profile-picture"
        />

        {/* Wrap each piece of info in a box */}
        <div className="info-box"><p><strong>الاسم:</strong> {volunteer.name}</p></div>
        <div className="info-box"><p><strong>البريد الإلكتروني:</strong> {volunteer.email}</p></div>
        <div className="info-box"><p><strong>المدينة:</strong> {volunteer.city}</p></div>
        <div className="info-box"><p><strong>تاريخ الميلاد:</strong> {new Date(volunteer.birthday).toLocaleDateString()}</p></div>
        <div className="info-box"><p><strong>مساهمات سابقة:</strong> {volunteer.opportunitiesParticipated}</p></div>
        <div className="info-box"><p><strong>مساهمات حالية:</strong> {volunteer.currentOpportunities}</p></div>
      </div>
    </div>
  );
};

export default VolunteerProfileModal;
