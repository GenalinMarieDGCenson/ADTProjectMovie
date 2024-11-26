import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Add a separate CSS file for better maintainability.

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/user/login', { email, password });
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/main/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back!</h1>
        <p>Sign in to your account to continue.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-container">
            <input
              type={isShowPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="show-password-btn"
            >
              {isShowPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <span className="spinner-border spinner-border-sm" /> : 'Login'}
        </button>
        <div className="register-link">
          <a href="/register">Don't have an account? Register</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
