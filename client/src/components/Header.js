import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

function Header(props) {
  const currentLocation = useLocation();
  const logout = async e => {
    e.preventDefault();

    await axios.get('/api/logout');

    props.setState((oldState) => {
      return {
        ...oldState,
        user: null
      }
    })
  }

  return (
    <header className="header">

      <nav className="nav">
        {props.state.user && <p className="header-username">Welcome, {props.state.user.username}</p>}
        {currentLocation.pathname !== '/' && <NavLink to="/">Home</NavLink>}
        {props.state.user ? (
          <>
            
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink onClick={logout} to="/logout">Log Out</NavLink>
          </>
        ) : (
          <div className="link-container">
          <NavLink to="/auth">Login or Register</NavLink>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header;

