import { useState, useEffect } from 'react';
import { TailSpin as Loader } from 'react-loader-spinner';
import { useNavigate, Link } from 'react-router-dom';
import { useUserDetails } from '../../context';
import './index.css';

const pageState = ['Loading', 'Success', 'Fail'];

const Login = () => {
  const { userId, setId, setRole } = useUserDetails();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setPw] = useState(false);
  const [pageView, setView] = useState(pageState[1]);
  const [errMsg, setErrmsg] = useState('');

  const options = {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim(),
      password: password,
    }),
  };

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
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setView(pageState[1]);
        setErrmsg('');
        setUsername('');
        setPassword('');
        setId(data.userId);
        setRole(data.role);
        setView(pageState[1]);
      } else {
        setView(pageState[2]);
        console.log(data.message);
        setErrmsg(data.message);
      }
    } catch (er) {
      setView(pageState[2]);
      console.log(er.message);
      setErrmsg(er.message);
    }
  };

  return (
    <div className='main-container'>
      <div className='login-container'>
        <h2>Login</h2>
        <form id='loginForm' onSubmit={(e) => login(e)}>
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
            />{' '}
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
          <p className='signup-para'>
            Click here for <Link to='/signup'>Signup</Link>
          </p>
          {errMsg !== '' && (
            <p className='error-message' id='errorMessage'>
              *{errMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
