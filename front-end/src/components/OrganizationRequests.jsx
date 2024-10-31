import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrganizationRequests.css'; 
import VolunteerProfileModal from './VolunteerProfileModal'; // Import the modal component

const OrganizationRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null); // Track selected volunteer for viewing profile

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/organization/requests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestUpdate = async (requestId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/organization/requests/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
  
      console.log('Response from server:', response.data);
  
      // If the request is accepted, increment the currentParticipants for the related opportunity
      if (status === 'مقبول') {
        await axios.put(
          `http://localhost:5000/organization/opportunities/increment/${response.data.opportunityId}`, // Ensure this endpoint exists in your backend
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
      }
  
      // Update the local state to reflect the change
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      console.error('Error updating request status:', error.response ? error.response.data : error.message);
    }
  };
  

  // Function to handle showing the volunteer's profile
  const handleViewProfile = (volunteer) => {
    setSelectedVolunteer(volunteer); // Set the selected volunteer's details in state
  };

  // Function to close the profile modal
  const handleCloseProfile = () => {
    setSelectedVolunteer(null); // Clear the selected volunteer when the modal is closed
  };

  return (
    <div className="requests-container">
      <h1>طلبات المشاركة</h1>
      <br />
      {requests.length === 0 ? (
        <p>.لا يوجد طلبات</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="request-card">
            <div className="request-left">
              <img
                src={`http://localhost:5000${req.volunteer.profilePicture || '/images/default-profile.png'}`}
                alt={req.volunteer.name}
                className="volunteer-image"
              />
              <div className="request-info">
                <h3>{req.volunteer.name}</h3>
                <p id="Req-title">{req.opportunity.title}</p>
                {/* Button to view the full profile */}
                <button className="view-profile" onClick={() => handleViewProfile(req.volunteer)}>
                  رؤية الحساب
                </button>
              </div>
            </div>
            <div className="request-right">
              {req.status === 'pending' ? (
                <>
                  <button
                    className="accept-btn"
                    onClick={() => handleRequestUpdate(req._id, 'مقبول')}
                  >
                    قبول
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleRequestUpdate(req._id, 'مرفوض')}
                  >
                    رفض
                  </button>
                </>
              ) : (
                <p>{req.status}</p>
              )}
            </div>
          </div>
        ))
      )}

      {/* Modal for viewing volunteer profile */}
      {selectedVolunteer && (
        <VolunteerProfileModal
          volunteer={selectedVolunteer}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
};

export default OrganizationRequests;
