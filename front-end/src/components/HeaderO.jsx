import { Link } from 'react-router-dom';
import { useState } from 'react';
import SAHMLOGO from "./SAHMLOGO1.png";
import "./Header.css"; // Ensure you have this CSS file
import "./HeaderO.css"; // Create a new CSS file for organization-specific styles

const Header = ({ name, handleLogout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <header className="header-container">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap');
      </style>
      
      <div className="header-left">
        <img src={SAHMLOGO} alt="Logo" className="logo" />
      </div>
      
      <div className="header-center">
        <ul className="nav-links">
          <li className="nav-item" id='postButton'>
            <Link to="/postopportunity">+ نشر فرصة</Link>
          </li>
          <li className="nav-item"><a href="#academies">أسئلة واستفسارات</a></li>
          <li className="nav-item"><a href="#about">عن ساهم</a></li>
          <li className="nav-item"><Link to="/organizationhome">الرئيسية</Link></li>

        </ul>
      </div>
      
      <div className="header-right">
        <button className="lang-switch">En</button>

        {/* Dropdown for logged-in user */}
        <div 
          className="user-dropdown"
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <button className="user-name-btn">{name}<img src='public/profile.png'></img></button>
          
          {dropdownVisible && (
            <div className="dropdown-menu">
              <Link to="/organizationprofile" className="dropdown-item">الملف الشخصي</Link>
              <button onClick={handleLogout} className="dropdown-item">تسجيل الخروج</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


// import { Link } from 'react-router-dom';
// import SAHMLOGO from "./SAHMLOGO.png";
// import "./Header.css"; // Use the new CSS file

// const HeaderO = ({ name, handleLogout, onRequestsClick }) => {
//   return (
//     <header className="header-container">
//       <div className="header-left">
//         <img src={SAHMLOGO} alt="Logo" className="logo" />
//       </div>

//       <div className="header-center">
//         <ul className="nav-links">
//           <li className="nav-item">
//             <Link to="/postopportunity">+ نشر فرصة</Link>
//           </li>
//           <li className="nav-item">
//             <a href="#contribution">فرص المساهمة</a>
//           </li>
//           <li className="nav-item">
//             <a href="#home">الرئيسية</a>
//           </li>
//         </ul>
//       </div>

//       <div className="header-right">
//         <div className="dropdown">
//           <h2 className="user-login">{name} (منظمة)</h2>
//           <div className="dropdown-content">
//             <Link to="/organizationhome">الصفحة الرئيسية</Link>
//             <Link to="/organizationprofile">الملف الشخصي</Link>
//             <Link to="/GeneralQuestions">استفسارات عامة</Link>
//             <a onClick={onRequestsClick}>طلبات المشاركة</a>
//             <a onClick={handleLogout}>تسجيل الخروج</a>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default HeaderO;
