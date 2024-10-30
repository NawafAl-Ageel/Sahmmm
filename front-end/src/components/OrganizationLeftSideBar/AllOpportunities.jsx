import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/organization/opportunities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div>
      <h2>فرصنا</h2>
      <div className="opportunities-list">
        {opportunities.map(opp => (
          <div key={opp._id} className="opportunity-item">
            <h3>{opp.title}</h3>
            <p>تاريخ البداية: {new Date(opp.date).toLocaleDateString()}</p>
            <p>الموقع: {opp.location}</p>
            <p>عدد المشاركين المطلوب: {opp.participantsNeeded}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOpportunities;
