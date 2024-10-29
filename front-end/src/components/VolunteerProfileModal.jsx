// VolunteerProfileModal.jsx
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
        <p><strong>الاسم:</strong> {volunteer.name}</p>
        <p><strong>البريدالإلكتروني:</strong> {volunteer.email}</p>
        <p><strong>المدينة:</strong> {volunteer.city}</p>
        <p><strong>تاريخ الميلاد:</strong> {new Date(volunteer.birthday).toLocaleDateString()}</p>
        <p><strong>مساهمات سابقة:</strong> {volunteer.opportunitiesParticipated}</p>
        <p><strong>مساهمات حالية:</strong> {volunteer.currentOpportunities}</p>
      </div>
    </div>
  );
};

export default VolunteerProfileModal;
