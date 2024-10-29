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
        <h2>Volunteer Profile</h2>
        <img
          src={`http://localhost:5000${volunteer.profilePicture || '/images/default-profile.png'}`}
          alt={volunteer.name}
          className="volunteer-profile-picture"
        />
        <p><strong>Name:</strong> {volunteer.name}</p>
        <p><strong>Email:</strong> {volunteer.email}</p>
        <p><strong>City:</strong> {volunteer.city}</p>
        <p><strong>Date of Birth:</strong> {new Date(volunteer.birthday).toLocaleDateString()}</p>
        <p><strong>Opportunities Participated:</strong> {volunteer.opportunitiesParticipated}</p>
        <p><strong>Current Opportunities:</strong> {volunteer.currentOpportunities}</p>
      </div>
    </div>
  );
};

export default VolunteerProfileModal;
