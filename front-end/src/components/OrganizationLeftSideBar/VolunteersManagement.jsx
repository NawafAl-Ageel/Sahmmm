import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VolunteersManagement.css';

const VolunteersManagement = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [volunteersByOpp, setVolunteersByOpp] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Fetch all opportunities
  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/organization/opportunities', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setOpportunities(response.data);
      fetchVolunteersByOpportunity(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError('Failed to fetch opportunities. Please try again later.');
      setIsLoading(false);
    }
  };

  // Fetch volunteers for each opportunity
  const fetchVolunteersByOpportunity = async (opps) => {
    let volunteersData = {};
  
    try {
      for (const opp of opps) {
        console.log(`Fetching volunteers for opportunity: ${opp.title} (${opp._id})`); // Debug log
        const response = await axios.get(`http://localhost:5000/organization/volunteers/${opp._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
  
        const volunteers = response.data;
        console.log(`Volunteers fetched for ${opp.title}:`, volunteers); // Debug log
  
        // Filter volunteers for accepted status and if the opportunity is not in the past
        const filteredVolunteers = volunteers.filter((volunteer) => {
          const isFutureOpportunity = new Date(opp.date) >= new Date();
          return volunteer.status === 'accepted' && isFutureOpportunity;
        });
  
        volunteersData[opp._id] = filteredVolunteers;
      }
  
      setVolunteersByOpp(volunteersData);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError('Failed to fetch volunteers. Please try again later.');
    }
  };
  

  return (
    <div className="volunteers-management">
      <h2>إدارة المساهمين</h2>

      {isLoading ? (
        <p>جاري التحميل...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <div key={opp._id} className="opportunity-block">
              <h3 className="opportunity-title">{opp.title} ({new Date(opp.date).toLocaleDateString()})</h3>

              {volunteersByOpp[opp._id] && volunteersByOpp[opp._id].length > 0 ? (
                <ul className="volunteer-list">
                  {volunteersByOpp[opp._id].map((volunteer) => (
                    <li key={volunteer._id} className="volunteer-item">
                      {volunteer.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-volunteers">لا يوجد مساهمين مقبولين لهذه الفرصة</p>
              )}
            </div>
          ))
        ) : (
          <p className="no-opportunities">لا توجد فرص حالية</p>
        )
      )}
    </div>
  );
};

export default VolunteersManagement;
