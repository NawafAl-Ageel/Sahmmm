import { useState } from 'react';
import { Link } from 'react-router-dom';
import SingUpV from './SingUpV'; // Volunteer sign-up component
import SingUpO from './SingUpO'; // Organization sign-up component
import Header from './Header';

const SignUp = () => {
  const [selectedComponent, setSelectedComponent] = useState("volunteer");

  return (
    <div>
      <Header />
      <div className="main-section">
        <div className="content">
          <div className="donation-form">
            <h1 style={{ textAlign: "center" }} className="main-title">انشاء حساب</h1>

            {/* Radio Buttons to switch between Volunteer and Organization */}
            <div className="radio-group">
              <label className='radio-inline' htmlFor="organization">
                منظمة
                <input
                  className='radio-group'
                  type="radio"
                  id="organization"
                  value="organization"
                  checked={selectedComponent === "organization"}
                  onChange={() => setSelectedComponent("organization")}
                  name="typeUser"
                  required
                />
              </label>

              <label className='radio-inline' htmlFor="volunteer">
                مساهم
                <input
                  className='radio-group'
                  type="radio"
                  id="volunteer"
                  value="volunteer"
                  checked={selectedComponent === "volunteer"}
                  onChange={() => setSelectedComponent("volunteer")}
                  name="typeUser"
                  required
                />
              </label>
            </div>

            {/* Conditionally render the appropriate form based on the selected component */}
            {selectedComponent === "volunteer" ? (
              <SingUpV />  
            ) : (
              <SingUpO />  
            )}

            <br />
            <Link className='AccountSwitch' to="/singin">لديك حساب ؟</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
