import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLogoutUser } from '../store/authReducer';


const Navbar = () => {
    const user = useSelector((state) => state.auth.user); 
  

    const [localUser, setLocalUser] = useState(user)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setLocalUser(user)
        console.log(user)
    }, [user, dispatch]);
  

    const handleLogout = (e) => {
      e.preventDefault();
      dispatch(fetchLogoutUser());
      setLocalUser(null);
      navigate('/');
    };

  return (
    <nav className='navbar'>
      <Link to={'/'} className="app-name">Grin-Storage</Link>
      {localUser!==null ? ( // If user is logged in
        <div className="user-info">
          <div className="user-info_username"><p>Hello, {user.username}</p></div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      ) : ( // If no user is logged in
        <div className="auth-buttons_wrapper">
          <Link className='header_sign-in_btn' to="/sign-in">Login</Link>
          <Link className='header_sign-up_btn' to="/sign-up">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
