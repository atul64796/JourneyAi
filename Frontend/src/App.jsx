import React from "react"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Login from "./components/Login/Login"
import Register from "./components/Signup/Register"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
function App() {
  
  return (
    <>
    
    <Router>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
    </Routes>
    </Router>
    </>
  )
}

export default App
