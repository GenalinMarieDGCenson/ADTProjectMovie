import React, { useRef, useState, useEffect } from 'react';
import './ForgotPassword.css';
import axios from 'axios';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  // Consolidating form data into one state object
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    reenterPassword: '',
  });
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState('failed');

  // Refs for focusing the fields
  const refs = {
    email: useRef(),
    newPassword: useRef(),
    reenterPassword: useRef(),
  };

  // Debounced state for form data
  const userInputDebounce = useDebounce(formData, 2000);
  const navigate = useNavigate();

  const apiEndpoint = window.location.pathname.includes('/admin') ? '/admin/login' : '/user/resetpass';

  const handleOnChange = (event, fieldName) => {
    setDebounceState(false);
    setIsFieldsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: event.target.value,
    }));
  };

  const handleResetPassword = async () => {
    const { email, newPassword, reenterPassword } = formData;
    if (!newPassword || !reenterPassword) {
      setAlertMessage("Please fill in both password fields.");
      setIsError('failed');
      setTimeout(() => {
        setAlertMessage('');
        setIsError('failed');
      }, 2000);
    } else if (newPassword !== reenterPassword) {
      setAlertMessage("Mismatch Password. Please try again.");
      setIsError('failed');
      setStatus('loading');
      setTimeout(() => {
        setAlertMessage('');
        setIsError('failed');
        setStatus('idle');
      }, 2000);
    } else {
      setStatus('loading');
      try {
        const response = await axios.patch(apiEndpoint, { email, password: newPassword }, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        setAlertMessage(response.data.message);
        setIsError('success');
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
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="color-page">
      <div className="ResetPassword-Form">
        {!alertMessage && (
          <span className="cancel-reset-btn" onClick={() => navigate('/')}>&times;</span>
        )}
        {alertMessage && (
          <div className={`text-message-box-${isError}`}>
            {alertMessage}
          </div>
        )}
        <h1 className="text-title-reset"><strong>Reset Password</strong></h1>
        <hr />
        <form className="box-form-reset">
          {['email', 'newPassword', 'reenterPassword'].map((field, idx) => (
            <div key={idx}>
              <label htmlFor={field}><strong>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong></label>
              <input
                type={field === 'email' ? 'email' : 'password'}
                id={field}
                name={field}
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={(e) => handleOnChange(e, field)}
                ref={refs[field]}
                required
              />
              <div className="error-display">
                {debounceState && isFieldsDirty && formData[field] === '' && (
                  <span className="text-danger-reset"><strong>This field is required</strong></span>
                )}
              </div>
            </div>
          ))}
          
          <div className="button-box-reset">
            <button
              type="button"
              className="btn"
              disabled={status === 'loading'}
              onClick={() => {
                if (formData.email && formData.newPassword && formData.reenterPassword) {
                  handleResetPassword();
                } else {
                  setIsFieldsDirty(true);
                  Object.entries(formData).forEach(([key, value]) => {
                    if (value === '') refs[key].current.focus();
                  });
                }
              }}
            >
              {status === 'idle' ? 'Change Password' : 'Loading...'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
