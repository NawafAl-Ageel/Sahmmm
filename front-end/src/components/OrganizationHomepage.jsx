
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderO from "./HeaderO";
import './OrganizationHomePage.css';
import OrganizationRequests from './OrganizationRequests';

const OrganizationHomePage = ({ user, handleLogout }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [editingOpportunityId, setEditingOpportunityId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/organization/opportunities', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setOpportunities(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setError('Failed to fetch opportunities. Please try again later.');
      setIsLoading(false);
    }
  };

  const deleteOpp = async (oppId) => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذه الفرصة؟')) {
      try {
        const response = await axios.delete(`http://localhost:5000/organization/opportunities/${oppId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.status === 200) {
          setOpportunities(opportunities.filter(opp => opp._id !== oppId));
          alert('تم حذف الفرصة بنجاح');
        }
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        alert('حدث خطأ أثناء حذف الفرصة');
      }
    }
  };

  const toggleRequestsModal = () => {
    setShowRequestsModal(!showRequestsModal);
  };

  const handleEditClick = (oppId) => {
    setEditingOpportunityId(oppId);
  };

  const handleUpdateOpportunity = (updatedOpportunity) => {
    setOpportunities(opportunities.map(opp => 
      opp._id === updatedOpportunity._id ? updatedOpportunity : opp
    ));
    setEditingOpportunityId(null);
  };

  const EditOpportunityForm = ({ opportunityId, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      title: '',
      date: '',
      location: '',
      participants: '',
      description: '',
      duration: '',
      image: null
    });

    useEffect(() => {
      const fetchOpportunity = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/organization/opportunities/${opportunityId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          const opp = response.data;
          setFormData({
            title: opp.title,
            date: new Date(opp.date).toISOString().split('T')[0],
            location: opp.location,
            participants: opp.participantsNeeded,
            description: opp.description,
            duration: opp.duration,
            image: null
          });
        } catch (error) {
          console.error('Error fetching opportunity:', error);
        }
      };

      fetchOpportunity();
    }, [opportunityId]);

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: files ? files[0] : value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      try {
        const response = await axios.put(
          `http://localhost:5000/organization/opportunities/${opportunityId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.status === 200) {
          onUpdate(response.data.opportunity);
          onClose();
        }
      } catch (error) {
        console.error('Error updating opportunity:', error);
      }
    };
    console.log(formData);
    return (
      <div className="edit-opportunity-form-container">
        <button onClick={onClose} className="close-button">X</button>
        <form onSubmit={handleSubmit} className="edit-opportunity-form">
          <h2 className="form-title">تعديل الفرصة</h2>
          <div className="form-group">
            <label htmlFor="title">العنوان:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="date">التاريخ:</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="location">الموقع:</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="participants">عدد المشاركين المطلوب:</label>
            <input type="number" id="participants" name="participants" value={formData.participants} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">الوصف:</label>
            <textarea id="description" name="description" text={formData.description} onChange={handleChange} required />
          </div>
          <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          <div className="form-group">
            <label htmlFor="duration">المدة:</label>
            <input type="text" id="duration" name="duration" value={formData.duration} min={1} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">الصورة:</label>
            <input type="file" id="image" name="image" onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">تحديث الفرصة</button>
            <button type="button" onClick={onClose} className="cancel-button red-button">إلغاء</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      <HeaderO 
        name={user.name} 
        handleLogout={handleLogout} 
        onRequestsClick={toggleRequestsModal}
      />
      <div className="main-section">
       
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="opportunities-container">
            {opportunities.length > 0 ? (
              opportunities.map((opp) => (
                <div key={opp._id} className="opportunity-card">
                  <img 
                    src={`http://localhost:5000/uploads/${opp.image}`} 
                    alt={opp.title} 
                    className="opportunity-image"
                  />
                  <h3 className="opportunity-title">{opp.title}</h3>
                  <p className="opportunity-date">{new Date(opp.date).toLocaleDateString()}</p>
                  <button onClick={() => handleEditClick(opp._id)} className="edit-button">تعديل الفرصة</button>
                  <button onClick={() => deleteOpp(opp._id)} className="delete-button">حذف الفرصة</button>
                </div>
              ))
            ) : (
              <p>لا يوجد فرص </p>
            )}
          </div>
        )}
      </div>

      {showRequestsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={toggleRequestsModal}>X</button>
            <OrganizationRequests user={user} />
          </div>
        </div>
      )}

      {editingOpportunityId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditOpportunityForm 
              opportunityId={editingOpportunityId}
              onClose={() => setEditingOpportunityId(null)}
              onUpdate={handleUpdateOpportunity}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationHomePage;