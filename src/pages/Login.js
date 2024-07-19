import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/Login.css';
import loginImg from '../assets/images/login.svg';
import { FaPenClip } from "react-icons/fa6";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validateUsername = () => {
    if (!username) {
      setUsernameError("Please enter your username");
      return false;
    }
    setUsernameError("");
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
    const isPasswordValid = validatePassword();

    if (!isUsernameValid || !isPasswordValid) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { id } = await response.json();
      setUserInfo({ id: id, username: username });
      localStorage.setItem('userInfo', JSON.stringify({ id: id, username: username }));
      toast.success("Login successful!", {
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
      toast.error("Invalid login information!", {
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
    <div className="main-login">
      <div className="login-contain row">
        <ToastContainer />
        <div className="col-sm-4 left-side">
          <div className="icon-box">
            <FaPenClip className="login-icon" />
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className="label-login">
              Username
            </label>
            <input
              placeholder="Enter your username..."
              type="text"
              className={`input-login ${usernameError ? "is-invalid" : ""}`}
              id="username"
              value={username}
              onBlur={handleBlur("username")}
              onChange={handleUsernameChange}
            />
            {usernameError && (
              <span className="invalid-feedback text-danger">
                {usernameError}
              </span>
            )}

            <label htmlFor="password" className="label-login mt-4">
              Password
            </label>
            <input
              placeholder="Enter password..."
              type="password"
              className={`input-login ${passwordError ? "is-invalid" : ""}`}
              id="password"
              onBlur={handleBlur("password")}
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <span className="invalid-feedback text-danger">
                {passwordError}
              </span>
            )}

            <button type="submit" id="sub-button" className="mt-4">
              Log in
            </button>
            <div className="register-link mt-3">
              Don't have an account? <a href="/register">Register now</a>
            </div>
          </form>
        </div>
        <div className="right-side d-none d-sm-block col-4">
          <div className="loginNote">
            <h2 className="text-note">Welcome Back!</h2>
          </div>
          <div className="loginImgBox">
            <img alt="" src={loginImg} id="loginImg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
