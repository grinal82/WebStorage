import React, { useEffect } from 'react'
import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux'
import { fetchRegisterUser, clearError } from '../store/authReducer'

export const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const registerError = useSelector((state) => state.auth.error);

  const [formValid, setFormValid] = useState(false)
  
  const [registerUser, setRegisterUser] = useState({
      username: '',
      email: '',
      password: '',
  })

  const [ inputDirty, setInputDirty ] = useState({
    username: false,
    email: false,
    password: false
  })

  const [inputError, setInputError] = useState({
    username: 'The field cannot be empty',
    email: 'The field cannot be empty',
    password: 'The field cannot be empty'
  })

  useEffect(()=>{
      if(inputError.username || inputError.email || inputError.password) {
        setFormValid(false)
      } else {
        setFormValid(true)
      }
    },[inputError])


  const blurHandler = (e) => {
    const { name, value } = e.target;
  
    setInputDirty((prevState) => ({
      ...prevState,
      [name]: true,
    }));
  
    // Reset the error message to "The field cannot be empty" if the input is empty
    setInputError((prevState) => ({
      ...prevState,
      [name]: value.trim() === '' ? 'The field cannot be empty' : prevState[name],
    }));
  };
  

  const changeHandler = (e) => {
    const { name, value } = e.target;
  
    setRegisterUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  
    setInputDirty((prevState) => ({
      ...prevState,
      [name]: false
    }));
    
    // Minimum 4 characters, starting with the latin letter
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;

    // Stadard email pattenr verification
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Minimum 6 characters, at least one uppercase letter, one digit, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
  
    const { username, email, password } = registerUser;
  
    setInputError((prevState) => ({
      ...prevState,
      username: name === 'username' && (username === '' || !usernameRegex.test(value)) ? 'Username should start with a latin letter and contain at least 4 characters' : '',
      email: name === 'email' && (email === '' || !emailRegex.test(value)) ? 'Invalid email pattern' : '',
      password: name === 'password' && (password === '' || !passwordRegex.test((String(value)))) ? 'Password should include 1 digit, 1 capital letter, one special character, and be at least 6 characters long' : ''
    }));
  };
    
  const handleSubmit = (e) => {
    e.preventDefault();
  // Dispatch registration and navigate to sign-in on success
    dispatch(fetchRegisterUser(registerUser)).then((action) => {
      const isRegisterUserFulfilled = fetchRegisterUser.fulfilled.match(action);
      if (isRegisterUserFulfilled) {
        dispatch(clearError());
        navigate(`/sign-in`);
      }
    });
};
      

  return (
    <div className="wrapper">
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className="input-box">
                {(inputDirty.username && inputError.username) && <div className="error" style={{color: 'red', position: 'absolute', left: '380px', backgroundColor: 'antiquewhite', width: '15rem', borderRadius: '15px', padding: '5px'}}>{inputError.username}</div>}
                <input 
                name='username' 
                type="text"
                value={registerUser.username}
                onBlur={(e) => blurHandler(e)} 
                onChange={(e) => changeHandler(e)} 
                placeholder="Username" required
                />
                <i className='bx bxs-user'></i>
            </div>
            <div className="input-box">
                {registerError && <p className="error" style={{color: 'red'}}>{registerError}</p>}
                {(inputDirty.email && inputError.email) && <div className="error" style={{color: 'red', position: 'absolute', left: '380px', backgroundColor: 'antiquewhite', width: 'max-content', borderRadius: '15px', padding: '5px'}}>{inputError.email}</div>}
                <input 
                name='email' 
                type="email"
                value={registerUser.email}
                onBlur={(e) => blurHandler(e)} 
                onChange={(e) => changeHandler(e)} 
                placeholder="enter your email" required
                />
                <i className='bx bx-envelope'></i>
            </div>
            <div className="input-box">
                
                <input 
                name='password' 
                type="password"
                value={registerUser.password}
                onBlur={(e) => blurHandler(e)} 
                onChange={(e) => changeHandler(e)} 
                placeholder="enter your password" required
                />
                <i className='bx bxs-lock-alt'></i>
                {(inputDirty.password && inputError.password) && <div className="error" style={{color: 'red', position: 'absolute', left: '380px', top: '-10px', backgroundColor: 'antiquewhite', width: '15rem',height: '7rem', borderRadius: '15px', padding: '5px'}}>{inputError.password}</div>}
            </div>
            <button
              type='submit'
              className="btn"
              disabled={!formValid}
              style={!formValid ? {cursor: 'not-allowed', backgroundColor: 'gray'} : {cursor: 'pointer'}}
            >Register
            </button>
        </form>
    </div>
  )
}
