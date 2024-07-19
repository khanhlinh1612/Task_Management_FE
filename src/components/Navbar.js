import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/images/logo.png';
import { UserContext } from '../context/UserContext';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import '../assets/Navbar.css';
import "../assets/Navbar.css"
function NavbarApp() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
  console.log("This is userInfo: " + userInfo);
  const userName = userInfo.username;

  function Logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    })
      .then(() => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
        navigate('/');
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  }

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href={'/dashboard'} className="brand">
          <img alt="" src={logo} width="35" height="35" className="d-inline-block align-top me-1" /> TaskTracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="info-container w-100">
            {userInfo ? (
              <div className="info-user">
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <div className='nav-script ms-2'>
                  {userName}
                </div>
                <Link onClick={Logout} className="nav-script ms-4">
                  Log out
                </Link>
              </div>
            ) : (
              <Link to="/login" className="nav-script">
                Log in
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarApp;
