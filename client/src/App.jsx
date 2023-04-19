import {BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import NotLogged from './pages/notLogged';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/notlogged" element={<NotLogged />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
