import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contactNo: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("idle");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);

  const debouncedInput = useDebounce(formState, 2000);

  const refs = {
    firstName: useRef(),
    middleName: useRef(),
    lastName: useRef(),
    contactNo: useRef(),
    email: useRef(),
    password: useRef(),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsFieldsDirty(true);
  };

  const handleShowPasswordToggle = () => setIsShowPassword((prev) => !prev);

  const validateFields = () => {
    return Object.entries(formState).every(([key, value]) => {
      if (!value.trim()) {
        refs[key]?.current?.focus();
        return false;
      }
      return true;
    });
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      setAlert({ message: "All fields are required.", type: "error" });
      return;
    }

    setStatus("loading");
    try {
      const { data } = await axios.post("/user/register", formState, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      localStorage.setItem("accessToken", data.access_token);
      setAlert({ message: data.message, type: "success" });
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred. Please try again.";
      setAlert({ message, type: "error" });
    } finally {
      setStatus("idle");
    }
  };

  useEffect(() => {}, [debouncedInput]);

  return (
    <div className="color-page">
      <div className="Register-Form">
        {alert.message && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}
        <h1 className="text-title">
          <strong>Welcome to MovieWebDB</strong>
        </h1>
        <p className="text-description">
          Sign up to unlock movies, reviews, and discover new content!
        </p>
        <hr />
        <form className="box-form">
          {Object.keys(formState).map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{key.replace(/([A-Z])/g, " $1")}</label>
              <input
                type={key === "password" && !isShowPassword ? "password" : "text"}
                id={key}
                name={key}
                ref={refs[key]}
                value={formState[key]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <div className="form-check">
            <input
              type="checkbox"
              id="showPassword"
              onChange={handleShowPasswordToggle}
            />
            <label htmlFor="showPassword">
              {isShowPassword ? "Hide" : "Show"} Password
            </label>
          </div>
          <div className="button-box-register">
            <button
              type="button"
              className="btn btn-primary"
              disabled={status === "loading"}
              onClick={handleRegister}
            >
              {status === "idle" ? "Register" : "Loading..."}
            </button>
            <div className="text-center">
              <a href="/">Already have an account? Login</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
