import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SingUp from './components/SingUp';
import SingIn from './components/SingIn';
import OrganizationProfile from './components/OrganizationProfile';
import VolunteerProfile from './components/VolunteerProfile';
import OrganizationHomepage from './components/OrganizationHomepage';
import VolunteerHomepage from './components/VolunteerHomepage';
import PostOpp from './components/PostOpp'; // Import the PostOpp component
import OpportunityDetails from './components/OpportunityDetails'; // For viewing details of an opportunity
import OrganizationRequests from './components/OrganizationRequests'; // Import the organization requests component
import Home from "./components/Home";
import History from './components/History';
import "./components/ProjectStyle.css";

const App = () => {
  const [volunteerToken, setVolunteerToken] = useState(null);
  const [organizationToken, setOrganizationToken] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setVolunteerToken(null);
    setOrganizationToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  console.log('Volunteer Token:', volunteerToken);
  console.log('Organization Token:', organizationToken);
  console.log('User:', user);
  
  return (
    <Router>
      <Routes>
        {/* If there is no volunteer or organization token */}
        {!volunteerToken && !organizationToken ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/singup" element={<SingUp />} />
            <Route path="/singin" 
              element={<SingIn 
                setVolunteerToken={setVolunteerToken} 
                setOrganizationToken={setOrganizationToken} 
                setUser={setUser} 
              />} 
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            {/* If there is an organization token */}
            {organizationToken ? (
              <>
                <Route path="/organizationprofile" 
                  element={<OrganizationProfile 
                    user={user} 
                    setUser={setUser} 
                    setOrganizationToken={setOrganizationToken} 
                    handleLogout={handleLogout} 
                  />} 
                />
                <Route path="/organizationhome" 
                  element={<OrganizationHomepage 
                    user={user} 
                    handleLogout={handleLogout} 
                  />} 
                />
                {/* Route for Posting an Opportunity */}
                <Route path="/postopportunity" 
                  element={<PostOpp 
                    name={user?.name} 
                    handleLogout={handleLogout} 
                  />} 
                />
                {/* Route for Viewing an Opportunity's Details */}
                <Route path="/opportunity/:id" 
                  element={<OpportunityDetails 
                    user={user} 
                    handleLogout={handleLogout} 
                  />} 
                />
                <Route path="/organizationrequests" 
  element={<OrganizationRequests 
    user={user} 
  />} 
/>

                {/* Route for Viewing Participation Requests */}
                <Route path="/organization/requests" 
                  element={<OrganizationRequests 
                    user={user} 
                    handleLogout={handleLogout} 
                  />} 
                />
              </>
            ) : (
              <>
                {/* If there is a volunteer token */}
                <Route path="/volunteerprofile" 
                  element={<VolunteerProfile 
                    user={user} 
                    setUser={setUser} 
                    setVolunteerToken={setVolunteerToken} 
                    handleLogout={handleLogout} 
                  />} 
                />
                <Route path="/volunteerhome" 
                  element={<VolunteerHomepage 
                    user={user} 
                    handleLogout={handleLogout} 
                  />} 
                />
                 <Route path="/history" 
                  element={<History 
                    user={user} 
                    handleLogout={handleLogout}  
                  />} 
                />
                {/* Route for Viewing an Opportunity's Details */}
                <Route path="/opportunity/:id" 
                  element={<OpportunityDetails 
                    user={user} 
                    handleLogout={handleLogout} 
                  />} 
                />
              </>
            )}
            {/* Redirect based on whether the token is for organization or volunteer */}
            <Route path="*" element={<Navigate to={organizationToken ? '/organizationhome' : '/volunteerhome'} />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
