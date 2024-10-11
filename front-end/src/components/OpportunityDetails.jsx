import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HeaderO from './HeaderO'; // Assuming you want the same header

const OpportunityDetails = ({ user, handleLogout }) => {
  const { id } = useParams(); // Get opportunity ID from URL
  const [opportunity, setOpportunity] = useState(null);

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/opportunity/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setOpportunity(response.data); // Set opportunity details in state
      } catch (error) {
        console.error('Error fetching opportunity details:', error);
      }
    };

    fetchOpportunityDetails();
  }, [id]);

  if (!opportunity) return <div>Loading...</div>;

  return (
    <div>
      <HeaderO name={user.name} handleLogout={handleLogout} />
      <div className="opportunity-details">
        <h2>{opportunity.title}</h2>
        <img src={`http://localhost:5000/uploads/${opportunity.image}`} alt={opportunity.title} />
        <p><strong>Date:</strong> {new Date(opportunity.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {opportunity.location}</p>
        <p><strong>Participants Needed:</strong> {opportunity.participantsNeeded}</p>
        <p><strong>Duration:</strong> {opportunity.duration} hours</p>
        <p><strong>Description:</strong> {opportunity.description}</p>
      </div>
    </div>
  );
};

export default OpportunityDetails;
