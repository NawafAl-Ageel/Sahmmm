import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderV from "./HeaderV";
import OpportunityDetails from './OpportunityDetails'; // Import the modal component
import './VolunteerHomepage.css'; // Styles for the homepage and modal

const saudiCities = [
  "الرياض", "جدة", "المدينة", "المنورة", "تبوك", "الدمام", "الاحساء", "القطيف", 
  "خميس مشيط", "المظيلف", "الهفوف", "المبرز", "الطائف", "نجران", "حفر الباطن", 
  "الجبيل", "ضباء", "الخرج", "الثقبة", "ينبع البحر", "الخبر", "عرعر", "الدوادمي", 
  "عنيزة", "سكاكا", "جازان", "القريات", "الظهران", "الباحة", "الزلفي", "الرس", 
  "وادي الدواسر", "بيشة", "سيهات", "شرورة", "بحرة", "تاروت", "صبيا", "بدر", 
  "أحد رفيدة", "الفرشة", "الحوطة", "الافلاج" // Add all cities as needed
];

const VolunteerHomepage = ({ user, handleLogout }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [date, setDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('all'); // Default to 'all'

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/opportunities', {
          params: { category: filter === 'all' ? '' : filter },
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
  }, [filter]); // Add filter as a dependency

  const handleCardClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOpportunity(null);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || opp.category === filter;
    const matchesDate = !date || new Date(opp.date) >= new Date(date);
  
    // Correctly define matchesLocation inside the filter function
    const matchesLocation = 
      locationFilter === 'خارج السعودية'
        ? !saudiCities.includes(opp.location)
        : locationFilter === 'all' || opp.location === locationFilter;
  
    return matchesSearch && matchesFilter && matchesDate && matchesLocation;
  });

  return (
    <div>
  <HeaderV name={user.name} handleLogout={handleLogout} />
  <div className="main-section">
    <div className="homepage-container">
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="ابحث"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
<div className="location-filter-container">
<label htmlFor="locationFilter" className="filter-label">التصفية حسب الموقع</label>
<select value={locationFilter}onChange={(e) => setLocationFilter(e.target.value)} className="filter-dropdown">
<option value='all'>الكل</option><option value="خارج السعودية">خارج السعودية</option>
  <option value="الأحساء">الأحساء</option><option value="الأفلاج">الأفلاج</option><option value="الباحة">الباحة</option>
  <option value="الجبيل">الجبيل</option><option value="الجوف">الجوف</option><option value="الخبر">الخبر</option>
  <option value="الخرج">الخرج</option><option value="الدرعية">الدرعية</option><option value="الرس">الرس</option>
  <option value="الرمحي">الرمحي</option><option value="الرياض">الرياض</option><option value="الزلفي">الزلفي</option>
  <option value="السليل">السليل</option><option value="الطائف">الطائف</option><option value="الظهران">الظهران</option>
  <option value="العلا">العلا</option><option value="القطيف">القطيف</option><option value="القنفذة">القنفذة</option>
  <option value="القصيم">القصيم</option><option value="المدينة المنورة">المدينة المنورة</option><option value="المجاردة">المجاردة</option>
  <option value="المجمعة">المجمعة</option><option value="المذنب">المذنب</option><option value="المزاحمية">المزاحمية</option>
  <option value="المظيلف">المظيلف</option><option value="الهفوف">الهفوف</option><option value="بدر">بدر</option>
  <option value="بقيق">بقيق</option><option value="بريدة">بريدة</option><option value="بيشة">بيشة</option>
  <option value="تبوك">تبوك</option><option value="تربة">تربة</option><option value="تيماء">تيماء</option>
  <option value="ثادق">ثادق</option><option value="جبيل">جبيل</option><option value="جدة">جدة</option>
  <option value="حائل">حائل</option><option value="حريملاء">حريملاء</option><option value="حفر الباطن">حفر الباطن</option>
  <option value="خميس مشيط">خميس مشيط</option><option value="الخفجي">الخفجي</option><option value="خليص">خليص</option>
  <option value="الدوادمي">الدوادمي</option><option value="الدلم">الدلم</option><option value="ضباء">ضباء</option>
  <option value="عرعر">عرعر</option><option value="عنيزة">عنيزة</option><option value="العيينة">العيينة</option>
  <option value="وادي الدواسر">وادي الدواسر</option><option value="الوجه">الوجه</option><option value="ينبع البحر">ينبع البحر</option>
  <option value="اليمامة">اليمامة</option><option value="الخرمة">الخرمة</option><option value="رفحاء">رفحاء</option>
  <option value="سكاكا">سكاكا</option><option value="صبيا">صبيا</option><option value="ضرما">ضرما</option>
  <option value="بيشة">بيشة</option><option value="فرسان">فرسان</option><option value="بني مالك">بني مالك</option>
  <option value="تنومة">تنومة</option>
</select>
</div>
        {/* Date Filter with Label */}
        <div className="date-filter-container">
          <label htmlFor="fromDate" className="filter-label">التصفية من هذا التاريخ</label>
          <input
            type="date"
            id="fromDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />
        </div>

        {/* Category Filter with Label */}
        <div className="category-filter-container">
          <label htmlFor="category" className="filter-label">التصفية حسب الفئة</label>
          <select
            id="category"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="all">الكل</option>
            <option value="program">بيئية</option>
            <option value="workshop">صحية</option>
            <option value="meetup">تنظيمية</option>
            <option value="webinar">اجتماعية</option>
            <option value="education">تعليمية</option>
            <option value="recreational">ترفيهية</option>
            <option value="sports">رياضية</option>
            <option value="relief">إغاثية</option>
          </select>


        </div>
        
      </div>
      


          <div className="opportunities-container">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp) => {
                const isFutureDate = new Date(opp.date) > new Date();
                const hasVacancy = opp.participantsNeeded > opp.currentParticipants;

                return (
                  <div key={opp._id} className="opportunity-card" onClick={() => handleCardClick(opp)}>
                    <img 
                      src={`http://localhost:5000/uploads/${opp.image}`} 
                      alt={opp.title} 
                      className="opportunity-image"
                    />

                    <div className="opportunity-header">
                      {isFutureDate  ? (
                        <span className="status-label available">متاح التسجيل</span>
                      ) : (
                        <span className="status-label unavailable">مغلق للتسجيل</span>
                      )}
                    </div>

                    <h3 className="opportunity-title">{opp.title}</h3>

                    <div className="opportunity-footer">
                      <div className="date">
                        <span className="icon">📅</span>
                        <span>{new Date(opp.date).toLocaleDateString()}</span>
                      </div>
                      <div className="duration">
                        <span className="icon">⏱</span>
                        <span>مدة {opp.duration} ساعات</span>
                      </div>
                      
                    </div>
                    
                  </div>
                  
                );
              })
            ) : (
              <p className="no-opportunities">لا توجد فرص حالية</p>
            )}
            
          </div>
          
        </div>

        {showModal && (
          <OpportunityDetails 
            opportunity={selectedOpportunity} 
            onClose={handleCloseModal} 
          />
        )}
      </div>
      
    </div>
  );
};

export default VolunteerHomepage;
