import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditDeleteOpportunities.css';

const EditDeleteOpportunities = ({ opportunities, setOpportunities }) => {
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    participantsNeeded: '',
    description: '',
    duration: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Pre-fill form data when an opportunity is being edited
  useEffect(() => {
    if (editingOpportunity) {
      setFormData({
        title: editingOpportunity.title,
        date: new Date(editingOpportunity.date).toISOString().split('T')[0],
        location: editingOpportunity.location,
        participantsNeeded: editingOpportunity.participantsNeeded,
        description: editingOpportunity.description,
        duration: editingOpportunity.duration,
        image: null,
      });
      setImagePreview(`http://localhost:5000/uploads/${editingOpportunity.image}`);
    }
  }, [editingOpportunity]);

  // Handle edit click
  const handleEditClick = (opportunity) => {
    setEditingOpportunity(opportunity);
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));

    if (name === 'image' && files && files[0]) {
      setImagePreview(URL.createObjectURL(files[0])); // Show preview of the new image
    }
  };

  // Handle delete click
  const handleDeleteClick = async (opportunityId) => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذه الفرصة؟')) {
      try {
        await axios.delete(`http://localhost:5000/organization/opportunities/${opportunityId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setOpportunities(opportunities.filter((opp) => opp._id !== opportunityId));
        alert('تم حذف الفرصة بنجاح');
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        alert('حدث خطأ أثناء حذف الفرصة');
      }
    }
  };

  // Handle form submit (Edit)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  // Confirm edit action
  const confirmEdit = async () => {
    const updatedFormData = new FormData();
    for (const key in formData) {
      updatedFormData.append(key, formData[key]);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/organization/opportunities/${editingOpportunity._id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const updatedOpportunity = response.data.opportunity;
        setOpportunities(opportunities.map((opp) =>
          opp._id === updatedOpportunity._id ? updatedOpportunity : opp
        ));
        setEditingOpportunity(null);
        alert('تم تحديث الفرصة بنجاح!');
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      alert('حدث خطأ أثناء تعديل الفرصة');
    }
    setShowConfirmation(false);
  };

  return (
    <div className="edit-delete-opportunities">
      <h2>تعديل وحذف الفرص</h2>

      <div className="opportunity-list">
        {opportunities.map((opportunity) => (
          <div key={opportunity._id} className="opportunity-item">
            <img 
              src={`http://localhost:5000/uploads/${opportunity.image}`} 
              alt={opportunity.title} 
              className="opportunity-image"
            />
            <h3>{opportunity.title}</h3>
            <p>{new Date(opportunity.date).toLocaleDateString()}</p>
            <button onClick={() => handleEditClick(opportunity)} className="edit-button">
              تعديل
            </button>
            <button onClick={() => handleDeleteClick(opportunity._id)} className="delete-button">
              حذف
            </button>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingOpportunity && (
        <div className="edit-opportunity-form">
          <h3>تعديل الفرصة: {editingOpportunity.title}</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>العنوان:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>التاريخ:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>الموقع:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>عدد المشاركين المطلوب:</label>
              <input
                type="number"
                name="participantsNeeded"
                value={formData.participantsNeeded}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>الوصف:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>المدة:</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>الصورة:</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>
            <button type="submit" className="submit-button">تحديث الفرصة</button>
            <button onClick={() => setEditingOpportunity(null)} className="cancel-button">إلغاء</button>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>هل أنت متأكد من أنك تريد تعديل هذه الفرصة؟</p>
            <button onClick={confirmEdit} className="confirm-button">نعم، تأكيد</button>
            <button onClick={() => setShowConfirmation(false)} className="cancel-button">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDeleteOpportunities;
