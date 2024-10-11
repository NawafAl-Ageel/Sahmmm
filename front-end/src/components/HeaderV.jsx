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
              <li style={{lineHeight:"2"}} className="nav-item"><li className="nav-item"> <Link to="/viewopps">ViewOpps</Link></li></li>
              <li style={{lineHeight:"2"}} className="nav-item"><Link to="/organizationprofile">PostOpps</Link></li>
              <li style={{lineHeight:"2"}} className="nav-item"><a href="#contribution">فرص المساهمة</a></li>
              <li style={{lineHeight:"2"}} className="nav-item"><a href="#home">الرئيسة</a></li>
              
              <div className="dropdown">
                  <h2 className='user-login'>{name} (Volunteer)</h2>
                  <div className="dropdown-content">
                    <Link to="/volunteerprofile">Profile</Link>
                    <Link to="/volunteerhome">Home</Link>
                    <a onClick={handleLogout}>Logout</a>
                  </div>
              
                  
                </div>
            </ul>
          </div>
        
      </div>
    </header>
  );
};

export default Header;
