import { Link } from 'react-router-dom';
import SAHMLOGO from "./SAHMLOGO.png";
import "./ProjectStyle.css";

const Header = ({ name, handleLogout, onRequestsClick }) => { // Added 'onRequestsClick'
  return (
    <header>
      <div className="header">
        <div className="logo">
          <img style={{ width: '90px', height: '70px' }} src={SAHMLOGO} alt="Logo" />
        </div>

        <div className="nav-links">
          <ul className="navbar-nav">
            <li style={{ lineHeight: "2" }} id="PostOpp" className="nav-item">
              <Link to="/postopportunity">+ نشر فرصة</Link>
            </li>
            <li style={{ lineHeight: "2" }} className="nav-item">
              <Link to="/viewopps">ViewOpps</Link>
            </li>
            <li style={{ lineHeight: "2" }} className="nav-item">
              <a href="#contribution">فرص المساهمة</a>
            </li>
            <li style={{ lineHeight: "2" }} className="nav-item">
              <a href="#home">الرئيسة</a>
            </li>

            <div className="dropdown">
              <h2 className='user-login'>{name} (منظمة)</h2>
              <div className="dropdown-content">
                <Link to="/organizationhome">الصفحة الرئيسية</Link>
                <Link to="/organizationprofile">الملف الشخصي</Link>
                <Link to="/GeneralQuestions">استفسارت عامة</Link>
                {/* Modified this to trigger modal */}
                <a onClick={onRequestsClick}>طلبات المشاركة</a> {/* <-- This will open the modal */}
                <a onClick={handleLogout}>تسجيل الخروج</a>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
