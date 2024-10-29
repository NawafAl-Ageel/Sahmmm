import { Link } from 'react-router-dom';
import SAHMLOGO from "./SAHMLOGO.png";
import "./ProjectStyle.css";

const Header = ({ name, handleLogout }) => {
  return (
    <header>
      <div className="header">
                <div className="logo">
                  <img style={{ width: '90px', height: '70px' }} src={SAHMLOGO} alt="Logo" />
                </div>

          <div className="nav-links">
              <ul className="navbar-nav">
                <li style={{lineHeight:"2"}} className="nav-item"><Link to="/viewopps">ViewOpps</Link></li>
                <li style={{lineHeight:"2"}} className="nav-item"><Link to="/organizationprofile">PostOpps</Link></li>
                <li style={{lineHeight:"2"}} className="nav-item"><a href="#contribution">فرص المساهمة</a></li>
                <li style={{lineHeight:"2"}} className="nav-item"><a href="#home">الرئيسة</a></li>
              
                <div className="dropdown">
                  <h2 className='user-login'>{name} (مساهم)</h2>
                        <div className="dropdown-content">
                          <Link to="/volunteerhome"> الصفحة الرئيسية</Link>
                          <Link to="/volunteerprofile">الملف الشخصي</Link>
                          <Link to="/GeneralQuestions">استفسارت عامة</Link>
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
