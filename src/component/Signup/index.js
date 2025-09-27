import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const SignUp = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    submit: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const url = 'http://localhost:5185/api/users';

  const validate = () => {
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
      role: '',
      submit: '',
    };

    if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!role) {
      newErrors.role = 'Please select a role.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => val === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    if (!validate()) return;

    const userData = {
      Role: role,
      Username: username,
      Password: password,
    };

    try {
      const response = await axios.post(url, userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccessMessage(response.data || 'User successfully signed up!');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('');
      setErrors({
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
        submit: '',
      });
    } catch (error) {
      const errorMsg = error.response?.data || 'An error occurred. Please try again.';
      setErrors((prev) => ({ ...prev, submit: errorMsg }));
    }
  };

  return (
    <div className='main-container'>
      <div className='login-signup-wrapper'>
        <div className='login-section'>
          <h2>Signup</h2>

          {successMessage && (
            <p className='success-message' id='signupMessage'>
              {successMessage}
            </p>
          )}
          {errors.submit && (
            <p className='error-message' id='submitError'>
              {errors.submit}
            </p>
          )}

          <form onSubmit={handleSubmit}>
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
              {errors.username && <p className='error-message'>{errors.username}</p>}
            </div>

            <div className='input-group'>
              <label htmlFor='password'>Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                id='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className='error-message'>{errors.password}</p>}
            </div>

            <div className='input-group'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                id='confirmPassword'
                name='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword}</p>}
            </div>

            <div className='input-group show-password'>
              <input
                checked={showPw}
                onChange={(e) => setShowPw(e.target.checked)}
                type='checkbox'
                id='showPassword'
              />
              <label htmlFor='showPassword'>Show Password</label>
            </div>

            <div className='input-group'>
              <label htmlFor='role'>Role</label>
              <select
                id='role'
                name='role'
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value='' disabled>
                  Select Role
                </option>
                <option value='Admin'>Admin</option>
                <option value='TeamMember'>TeamMember</option>
              </select>
              {errors.role && <p className='error-message'>{errors.role}</p>}
            </div>

            <button type='submit' className='login-button'>
              Signup
            </button>
          </form>
        </div>

        <div className='signup-section'>
          <h2>Already have an account?</h2>
          <p>Login and manage your tasks efficiently.</p>
          <Link to='/login' className='signup-link'>
            <button className='signup-button'>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
