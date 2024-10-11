import HeaderV from "./HeaderV";
const VolunteerHomepage = ({ user,handleLogout }) => {
  console.log('User object:', user); // Debugging the user object

  return (
    <div>
        <HeaderV name={user.name} handleLogout={handleLogout} />
      <div className="main-section">
        <br /><br /><br /><br /><br /><br />
        <h1 style={{ textAlign: 'center' }}>
          Volunteer Homepage {user?.name ? user.name : 'User not found'}
        </h1>
      </div>
    </div>
  );
};

export default VolunteerHomepage;
