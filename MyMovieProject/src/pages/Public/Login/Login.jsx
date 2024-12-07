import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { AuthContext } from '../../../utils/context/AuthContext';
import axios from 'axios';
import './Login.css';


const InputField = ({ label, type, value, onChange, error, refProp }) => (
  <div>
    <label htmlFor={label}><strong>{label}:</strong></label>
    <input
      type={type}
      id={label.toLowerCase()}
      name={label.toLowerCase()}
      value={value}
      onChange={onChange}
      ref={refProp}
    />
    {error && <div className="text-danger-login"><strong>{error}</strong></div>}
  </div>
);


const AlertBox = ({ message }) => (
  message && <div className="text-message-box">{message}</div>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const emailRef = useRef();
  const passwordRef = useRef();
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);

  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const apiEndpoint = window.location.pathname.includes('/admin') ? '/admin/login' : '/user/login';

  
  const toggleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  
  const handleInputChange = (setter) => (event) => {
    setIsFieldsDirty(true);
    setDebounceState(false);
    setter(event.target.value);
  };

  
  const handleLogin = async () => {
    if (!email || !password) {
      setIsFieldsDirty(true);
      if (!email) emailRef.current.focus();
      if (!password) passwordRef.current.focus();
      return;
    }

    setStatus('loading');
    try {
      const response = await axios.post(apiEndpoint, { email, password });
      const { access_token, user, message } = response.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthData({ accessToken: access_token, user });

      setAlertMessage(message);
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/main/dashboard' : '/home');
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Login failed.');
      setTimeout(() => {
        setAlertMessage('');
        setStatus('idle');
      }, 3000);
    }
  };

  
  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="color-page">
      <div className="Login-Form">
        <AlertBox message={alertMessage} />
        <h1 className="text-title"><strong>Welcome to MovieWebDB</strong></h1>
        <p className="text-description">Dive into the world of cinema magic. Discover hidden gems, explore timeless classics, and immerse yourself in the ultimate movie experience.</p>
        <hr />
        <form className="box-form">
          <InputField
            label="E-mail"
            type="text"
            value={email}
            onChange={handleInputChange(setEmail)}
            error={debounceState && isFieldsDirty && !email && 'This field is required'}
            refProp={emailRef}
          />
          <InputField
            label="Password"
            type={isShowPassword ? 'text' : 'password'}
            value={password}
            onChange={handleInputChange(setPassword)}
            error={debounceState && isFieldsDirty && !password && 'This field is required'}
            refProp={passwordRef}
          />
          <div className="selection-login">
            <div className="form-check">
              <input
                type="checkbox"
                id="showPassword"
                onClick={toggleShowPassword}
              />
              <label className="showpassword-login" htmlFor="showPassword">
                {isShowPassword ? 'Hide' : 'Show'} Password
              </label>
            </div>
            <a className="forgotpassword-login" href="/reset-password">Forgot Password?</a>
          </div>
          <div className="button-box-login">
            <button
              type="button"
              className="btn"
              disabled={status === 'loading'}
              onClick={handleLogin}
            >
              {status === 'loading' ? 'Loading...' : 'Login'}
            </button>
            <div className="text-center">
              <a href="/register">Don't have an account? Register</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
