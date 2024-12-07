import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import './Register.css'

function Register() {
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNo: '',
  });

  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState('failed');
  
  const navigate = useNavigate();
  const userInputDebounce = useDebounce(formData, 2000);

  
  const refs = {
    email: useRef(),
    password: useRef(),
    firstName: useRef(),
    middleName: useRef(),
    lastName: useRef(),
    contactNo: useRef(),
  };

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleOnChange = (event, fieldName) => {
    setDebounceState(false);
    setIsFieldsDirty(true);
    setFormData((prev) => ({ ...prev, [fieldName]: event.target.value }));
  };

  const apiEndpoint = window.location.pathname.includes('/admin') ? '/admin/register' : '/user/register';

  const handleRegister = async () => {
    const { email, password, firstName, middleName, lastName, contactNo } = formData;
    setStatus('loading');

    try {
      const res = await axios.post(apiEndpoint, formData, { headers: { 'Access-Control-Allow-Origin': '*' } });
      setAlertMessage(res.data.message);
      setIsError('success');
      localStorage.setItem('accessToken', res.data.access_token);
      
      setTimeout(() => {
        navigate('/');
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || error.message);
      setIsError('failed');
      setStatus('idle');
      setTimeout(() => setAlertMessage(''), 3000);
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="color-page">
      <div className="Register-Form">
        {alertMessage && (
          <div className={`text-message-box-${isError}`}>
            {alertMessage}
          </div>
        )}
        <div>
          <h1 className="text-title"><strong>Welcome to MovieWebDB</strong></h1>
          <p className="text-description">Step into the spotlight! Sign up to explore movies, read reviews, and uncover your next favorite hit!</p>
          <hr />
          <form className="box-form">
            {['firstName', 'middleName', 'lastName', 'contactNo', 'email'].map((field, idx) => (
              <div key={idx}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={(e) => handleOnChange(e, field)}
                  ref={refs[field]}
                  required
                />
                <div className="error-display-register">
                  {debounceState && isFieldsDirty && formData[field] === '' && (
                    <strong className="text-danger-register">This field is required</strong>
                  )}
                </div>
              </div>
            ))}

            <label htmlFor="password">Password:</label>
            <input
              type={isShowPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleOnChange(e, 'password')}
              ref={refs.password}
              required
            />
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                onClick={handleShowPassword}
              />
              <div className="form-check-label" htmlFor="showPassword">
                {isShowPassword ? 'Hide' : 'Show'} Password
              </div>
            </div>

            <div className="button-box-register">
              <button
                type="button"
                className="btn btn-primary"
                disabled={status === 'loading'}
                onClick={() => {
                  if (Object.values(formData).every((field) => field !== '')) {
                    handleRegister();
                  } else {
                    setIsFieldsDirty(true);
                    Object.entries(formData).forEach(([key, value]) => {
                      if (value === '') refs[key].current.focus();
                    });
                  }
                }}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
              <div className="text-center">
                <a href="/">Already have an account? Login</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
