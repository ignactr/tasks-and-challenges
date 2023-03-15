import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Git from './pages/Git';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Git" element={<Git />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
