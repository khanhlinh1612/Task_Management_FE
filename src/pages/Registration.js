import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/Registration.css';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validateUsername = () => {
    if (!username) {
      setUsernameError("Please enter your username");
      return false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Please enter a valid username");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError("Please enter your email");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Please enter your password");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleBlur = (field) => () => {
    switch (field) {
      case "username":
        validateUsername();
        break;
      case "email":
        validateEmail();
        break;
      case "password":
        validatePassword();
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userInfo = await response.json();
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      toast.success("Đăng ký thành công!", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (error) {
      toast.warning("Đăng ký thất bại!", {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="main-register">
      <div className="sphere"></div>
      <div className="register-contain">
        <ToastContainer />
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="register-title">Register</h2>
          <label htmlFor="username" className="label-register">
            Username
          </label>
          <input
            placeholder="Enter your username..."
            type="text"
            className={`input-register ${usernameError ? "is-invalid" : ""}`}
            id="username"
            value={username}
            onBlur={handleBlur("username")}
            onChange={handleUsernameChange}
          />
          {usernameError && <span className="invalid-feedback text-danger">{usernameError}</span>}

          <label htmlFor="email" className="label-register mt-4">
            Email
          </label>
          <input
            placeholder="Enter your email..."
            type="email"
            className={`input-register ${emailError ? "is-invalid" : ""}`}
            id="email"
            value={email}
            onBlur={handleBlur("email")}
            onChange={handleEmailChange}
          />
          {emailError && <span className="invalid-feedback text-danger">{emailError}</span>}

          <label htmlFor="password" className="label-register mt-4">
            Password
          </label>
          <input
            placeholder="Enter password..."
            type="password"
            className={`input-register ${passwordError ? "is-invalid" : ""}`}
            id="password"
            onBlur={handleBlur("password")}
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <span className="invalid-feedback text-danger">{passwordError}</span>}

          <button type="submit" id="register-button" className="mt-4">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
