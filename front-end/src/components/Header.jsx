import { Link } from 'react-router-dom';
import SAHMLOGO from "./SAHMLOGO.png";
import "./ProjectStyle.css";

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="logo">
          <img style={{ width: '90px', height: '70px' }} src={SAHMLOGO} alt="Logo" />
        </div>
       
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
      </div>
    </header>
  );
};

export default Header;
