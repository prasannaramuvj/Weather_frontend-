
import './App.css'
import Dashboard from './Pages/Dashboard.jsx';
import Loginpage from './Pages/Loginpage.jsx'
import Registerpage from './Pages/Registerpage.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/register" element={< Registerpage />} />
        <Route path="/dashboard" element={< Dashboard/>} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
