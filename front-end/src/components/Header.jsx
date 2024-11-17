import { Link } from 'react-router-dom';
import SAHMLOGO from "./SAHMLOGO1.png";
import "./Header.css"; // Import the new CSS file

const Header = () => {
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
          <li className="nav-item"><Link to="/faq">أسئلة واستفسارات</Link></li> {/* Link to FAQ page */}
          <li className="nav-item"><a href="#about">عن ساهم</a></li>
          <li className="nav-item"><a href="#home">الرئيسية</a></li>
        </ul>
      </div>
      <div className="header-right">
        <button className="lang-switch">En</button>
        <button className="login-btn">
          <Link to="/signin">تسجيل الدخول</Link>
        </button>
      </div>
    </header>
  );
};

export default Header;
