import { Link } from 'react-router-dom';
import SAHMLOGO from "./SAHMLOGO1.png";
import "./Header.css"; // Use the new CSS file

const HeaderV = ({ name, handleLogout }) => {
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
          <li className="nav-item">
            <a href="#contribution">فرص المساهمة</a>
          </li>
          <li className="nav-item">
          <li className="nav-item"> <Link to="/organizationhome">الرئيسية</Link></li>

          </li>
        </ul>
      </div>

      <div className="header-right">
        <div className="dropdown">
          <h2 className="user-login">{name} (مساهم)</h2>
          <div className="dropdown-content">
            <Link to="/volunteerhome">الصفحة الرئيسية</Link>
            <Link to="/volunteerprofile">الملف الشخصي</Link>
            <Link to="/GeneralQuestions">استفسارات عامة</Link>
            <a onClick={handleLogout}>تسجيل الخروج</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderV;
