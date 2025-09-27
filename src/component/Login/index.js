import { useState, useEffect } from 'react';
import { TailSpin as Loader } from 'react-loader-spinner';
import { useNavigate, Link } from 'react-router-dom';
import { useUserDetails } from '../../context';
import axios from 'axios';
import './index.css';
 
const pageState = ['Loading', 'Success', 'Fail'];
 
const Login = () => {
  const { userId, setUserId, setUserRole } = useUserDetails();
  const navigate = useNavigate();
 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setPw] = useState(false);
  const [pageView, setView] = useState(pageState[1]);
  const [errMsg, setErrmsg] = useState('');
 
  const url = 'http://localhost:5185/api/users/login';
 
  useEffect(() => {
    if (userId !== null) {
      navigate('/', { replace: true });
    }
  }, [userId, navigate]);
 
  const login = async (e) => {
    setView(pageState[0]);
    e.preventDefault();
 
    try {
      const response = await axios.post(
        url,
        {
          username: username.trim(),
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
 
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setView(pageState[1]);
        setErrmsg('');
        setUsername('');
        setPassword('');
        setUserId(data.userId);
        setUserRole(data.role);
      }
    } catch (error) {
      setView(pageState[2]);
      console.error(error.message);
      setErrmsg(error.response ? error.response.data.message : error.message);
    }
  };
 
  return (
    <div className='main-container'>
      <div className='login-signup-wrapper'>
        <div className='login-section'>
          <h2>Login</h2>
          <form id='loginForm' onSubmit={login}>
            <div className='input-group'>
              <label htmlFor='username'>Username</label>
              <input
                type='text'
                id='username'
                name='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='input-group'>
              <label htmlFor='password'>Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name='password'
                required
              />
            </div>
            <div className='input-group show-password'>
              <input
                value={showPw}
                onChange={(e) => setPw(e.target.checked)}
                type='checkbox'
                id='showPassword'
              />
              <label htmlFor='showPassword'>Show Password</label>
            </div>
            {pageView === pageState[0] && (
              <div className='loader-container'>
                <Loader width='50px' color='green' />
              </div>
            )}
            <button type='submit' className='login-button'>
              Login
            </button>
            {errMsg !== '' && (
              <p className='error-message' id='errorMessage'>
                *{errMsg}
              </p>
            )}
          </form>
        </div>
 
        <div className='signup-section'>
          <h2>New Here?</h2>
          <p>Sign up and manage your tasks efficiently.</p>
          <Link to='/signup' className='signup-link'>
            <button className='signup-button'>Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
 
export default Login;
 
 