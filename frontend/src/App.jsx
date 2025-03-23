import React from 'react'
import Home from './Home'
import {BrowserRouter as Router, Route, Routes, BrowserRouter} from 'react-router-dom'
import RegistrationForm from './Customer/RegistrationForm'
import RegisterFormP from './Professional/RegisterFormP'
import ProfileC from './Customer/CustomerProfile'
import Login from './Login'
import AfterLogin from './Customer/AfterLogin'
import Profile from './Professional/professionalProfile'
import ServiceResults from './Customer/ServiceResults'
import Admin from './Admin'

function App() {
  return (
    <div>
    
      <Router>
        <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/auth' element = {<Login/>}/>
          <Route path = '/customer/register' element = {<RegistrationForm/>}/>
          <Route path = '/professional/register' element = {<RegisterFormP/>}/>
          <Route path = '/customer/profile/:id' element = {<ProfileC/>}/>
          <Route path = '/search/:id' element = {<AfterLogin/>}/>
          <Route path = "/professional/profile/:id" element = {<Profile/>}/>
          <Route path = "/list" element = {<ServiceResults/>}/>
          <Route path = "/admin" element ={<Admin/>}/>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App;