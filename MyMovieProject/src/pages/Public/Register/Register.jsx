import { useState, useCallback } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleOnChange = (event, setter) => setter(event.target.value);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f7f7",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-center mb-4">Welcome to Movie Web App!</h3>
        <p className="text-center">
          Sign up to unlock the movies, reviews and discover new content!
        </p>

        <form>
          {[
            { label: "First Name", value: firstName, setter: setFirstName },
            { label: "Middle Name", value: middleName, setter: setMiddleName },
            { label: "Last Name", value: lastName, setter: setLastName },
            { label: "Contact Number", value: contactNo, setter: setContactNo },
            { label: "Email", value: email, setter: setEmail },
          ].map(({ label, value, setter }) => (
            <div key={label} className="mb-3">
              <label
                style={{
                  display: "block",
                  marginBottom: "8px", // Added spacing
                  fontSize: "14px",
                }}
              >
                {label}:
              </label>
              <input
                type="text"
                className="form-control"
                style={{
                  width: "95%",
                  padding: "10px", // Increased padding for comfort
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                value={value}
                onChange={(e) => handleOnChange(e, setter)}
              />
            </div>
          ))}

          <div className="mb-3">
            <label
              style={{
                display: "block",
                marginBottom: "8px", // Added spacing
                fontSize: "14px",
              }}
            >
              Password:
            </label>
            <input
              type={isShowPassword ? "text" : "password"}
              className="form-control"
              style={{
                width: "95%",
                padding: "10px", // Increased padding
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              value={password}
              onChange={(e) => handleOnChange(e, setPassword)}
            />
            <div
              className="form-check mt-2"
              style={{ textAlign: "center", marginTop: "10px" }}
            >
              <input
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                onClick={handleShowPassword}
              />
              <label
                className="form-check-label"
                htmlFor="showPassword"
                style={{ marginLeft: "5px" }}
              >
                Show Password
              </label>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary w-100"
            style={{
              padding: "10px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <a href="/" style={{ color: "#007bff" }}>
              Login
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
