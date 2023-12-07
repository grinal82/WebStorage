import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { fetchLoginUser } from '../store/authReducer'

export const LogIn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const loginError = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);

    const [currentUser, setCurrentUser] = useState({
        email: '',
        password: '',
    })

    // console.log(currentUser)


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchLoginUser(currentUser)).then((action) => {
          if (fetchLoginUser.fulfilled.match(action)) {
            const loggedInUser = action.payload;
            navigate(`/user/${loggedInUser['id']}`);
          }
        })

    }

  return (
    <div className="wrapper">
        <form onSubmit={handleSubmit}>
            <h1>Log In</h1>
            {loginError && <p className='error' style={{color: 'red', position: 'absolute', left: '422px',top: '160px', backgroundColor: 'antiquewhite', width: '15rem', borderRadius: '15px', padding: '5px'}}>{loginError}</p>}
            <div className="input-box">
                <input
                name='email' 
                type="email"
                value={currentUser.email} 
                placeholder="enter your email"
                onChange={(e) => setCurrentUser(
                    {...currentUser, email: e.target.value})} 
                required
                />
                <i class='bx bx-envelope'></i>
            </div>
            <div className="input-box">
                <input
                name='password' 
                type="password"
                value={currentUser.password} 
                placeholder="enter your password"
                onChange={(e) => setCurrentUser(
                    {...currentUser, password: e.target.value})} 
                required
                />
                <i class='bx bxs-lock-alt'></i>
            </div>
            <div className="remember-forgot">
                <label htmlFor=""><input type="checkbox" />Remember me</label>
                <a href="#">Forgot Password?</a>
            </div>
            {loading ? <div className="preloader">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div> : <button 
                        type='submit' 
                        className="btn">Login
                        </button>}
            <div className="register-link">
                <p><Link to="/sign-up">Register</Link></p>
            </div>
        </form>
    </div>
  )
}
