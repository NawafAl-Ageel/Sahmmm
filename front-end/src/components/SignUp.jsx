import { useState } from 'react';
import { Link } from 'react-router-dom';
import SingUpV from './SingUpV'; // Volunteer sign-up component
import SingUpO from './SingUpO'; // Organization sign-up component
import Header from './Header';
import './SignUp.css'; // Import the new CSS for styling

const SignUp = () => {
  const [selectedComponent, setSelectedComponent] = useState("volunteer");

  return (
    <div className="signup-page">
      <Header />
      <div className="main-section">
        <div className="signup-container">
          <h1 className="form-title">إنشاء حساب</h1>

          {/* Radio Buttons to switch between Volunteer and Organization */}
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                id="volunteer"
                value="volunteer"
                checked={selectedComponent === "volunteer"}
                onChange={() => setSelectedComponent("volunteer")}
                name="typeUser"
                required
              />
              <span className="radio-label">مساهم</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                id="organization"
                value="organization"
                checked={selectedComponent === "organization"}
                onChange={() => setSelectedComponent("organization")}
                name="typeUser"
                required
              />
              <span className="radio-label">منظمة</span>
            </label>
          </div>

          {/* Conditionally render the appropriate form based on the selected component */}
          <div className="form-content">
            {selectedComponent === "volunteer" ? <SingUpV /> : <SingUpO />}
          </div>

          <Link className="account-switch" to="/signin">لديك حساب ؟</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
