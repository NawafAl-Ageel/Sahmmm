import { Link } from 'react-router-dom';
import SAHMLOGO from "./SAHMLOGO.png";
import "./ProjectStyle.css";

const Header = ({ name, role, handleLogout }) => {
  return (
    <header>
      <div className="header">
        <div className="logo">
          <img style={{ width: '90px', height: '70px' }} src={SAHMLOGO} alt="Logo" />
        </div>

        {name ? (
          <div className="nav-links">
            <ul className="navbar-nav">
              <li className="nav-item"><a href="#contributors">عن المساهمون</a></li>
              <li className="nav-item"><a href="#about">عن ساهم</a></li>
              <li className="nav-item"><a href="#contribution">فرص المساهمة</a></li>
              <li className="nav-item"><a href="#home">الرئيسة</a></li>
              {role === 'organization' ? (
                <div className="dropdown">
                  <h2 className='user-login'>{name} (Organization)</h2>
                  <div className="dropdown-content">
                    <Link to="/organizationprofile">Profile</Link>
                    <Link to="/organizationhome">Home</Link>
                    <a onClick={handleLogout}>Logout</a>
                  </div>
                </div>
              ) : (
                <div className="dropdown">
                  <h2 className='user-login'>{name} (Volunteer)</h2>
                  <div className="dropdown-content">
                    <Link to="/volunteerprofile">Profile</Link>
                    <Link to="/volunteerhome">Home</Link>
                    <a onClick={handleLogout}>Logout</a>
                  </div>
                </div>
              )}
            </ul>
          </div>
        ) : (
          <div className="nav-links">
            <ul className="navbar-nav">
              <li style={{lineHeight:"2"}} className="nav-item"><a href="#contributors">عن المساهمون</a></li>
              <li style={{lineHeight:"2"}} className="nav-item"><a href="#about">عن ساهم</a></li>
              <li style={{lineHeight:"2"}} className="nav-item"><a href="#contribution">فرص المساهمة</a></li>
              <li style={{lineHeight:"2"}} className="nav-item"><a href="#home">الرئيسة</a></li>
              <div className="dropdown">
               <button>
                <Link style={{ textDecoration: "none", color: "white" }} to="/singin">تسجيل الدخول</Link>
              </button>
                  
                </div>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
