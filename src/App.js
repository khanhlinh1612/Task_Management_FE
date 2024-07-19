import './App.css';
import { Routes, Route, Navigate ,useLocation, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Task from './pages/Task';
import TaskDetail from './pages/TaskDetail';
import Login from './pages/Login';
import Registration from './pages/Registration';
import NavbarApp from './components/Navbar';
import React, {useContext} from 'react';
import { UserContextProvider, UserContext } from './context/UserContext';
function Layout() {
  const {userInfo} = useContext(UserContext);
  const location = useLocation();
  return userInfo? (
    <div>
       <NavbarApp />
      <Outlet/>
    </div>
  ) : (
    <Navigate to="/login" state={{from:location }} replace/>
  );
}
function App() {
  return(
    <UserContextProvider>
    <main>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Navigate to='/dashboard'/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/tasks" element={<Task/>}/>
          <Route path="/task/:id" element={<TaskDetail/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Registration/>} />
      </Routes>
    </main>
    </UserContextProvider>
  );
}

export default App;
