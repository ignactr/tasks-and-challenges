import {BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import NotLogged from './pages/notLogged';
import AddNewChallenge from './pages/AddNewChallenge';
import User from './pages/User';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/notlogged" element={<NotLogged />}/>
        <Route path="/addNewChallenge" element={<AddNewChallenge />}/>
        <Route path="/user" element={<User />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
