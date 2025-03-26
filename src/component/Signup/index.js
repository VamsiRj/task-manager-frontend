import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique userId
import './index.css';

function SignUp() {
  // const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ isError: false, msg: null }); // Success or error message

  const url = 'http://localhost:5185/api/users';
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      Role: role,
      Username: username,
      Password: password,
    };

    // Example API call to send user data
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.text();
      if (response.ok) {
        console.log('User successfully signed up:', data);
        setMessage({ isError: false, msg: data });
      } else {
        console.log('Something went wrong:', data);
        setMessage({ isError: true, msg: data });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage({ isError: true, msg: error.message });
    }

    // setName('');
    setRole('');
    setUsername('');
    setPassword('');
  };

  const { isError, msg } = message;
  return (
    <div className='sign-up-page'>
      <div className='sign-up-container'>
        <Link to='/login'>
          <button className='sign-log-btn'>Login</button>
        </Link>
        <h2>Sign Up</h2>
        {msg && (
          <div className={isError ? 'error-message' : 'success-message'}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {
            //   <div className='form-field'>
            //   <label htmlFor='name'>Name:</label>
            //   <input
            //     type='text'
            //     id='name'
            //     value={name}
            //     onChange={(e) => setName(e.target.value)}
            //     required
            //   />
            // </div>
          }

          <div className='form-field'>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className='form-field'>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='form-field'>
            <label htmlFor='role'>Role:</label>
            <select
              id='role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value='' disabled>
                Select your role
              </option>
              <option value='Admin'>Admin</option>
              <option value='TeamMember'>TeamMember</option>
            </select>
          </div>

          <button type='submit'>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
