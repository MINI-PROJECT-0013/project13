import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Registration.css";

function RegistrationForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    
    if (!formData) {
      console.error("formData is undefined!");
      return;
    }
    
    const formattedData = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      address: '${formData.streetAddress1} ${formData.streetAddress2}'.trim(),
      City: formData.city,
      State: formData.state,
      ZipCode: formData.postalCode,
      phoneNo: formData.phone,
      email: formData.email,
      password: formData.password
    };

    console.log("Form Data:", formData); 
    try {
      const response = await axios.post(
        "http://localhost:5000/customer/register",
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Registration successful:", response.data);
      navigate("/auth");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

   const handleHome = () => {
    navigate('/'); // Navigate to home page
  };
  
  const handleLogin = () => {
    navigate('/auth'); // Navigate to login page
  };
  
  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="navigation-icons">
          <button 
            className="nav-icon back-icon" 
            onClick= {handleBack}

          
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            className="nav-icon home-icon" 
            onClick={handleHome}
            title="Go to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
        </div>

        <div className="registration-flex-container">
          <div className="info-panel">
            <div className="info-panel-content">
              <h2 className="info-title">Household Management.</h2>
              
              <div className="info-section">
                <h3>Why become a Household Management customer? 🏠</h3>
                <ul className="benefit-list">
                  <li>Become part of the home organization community</li>
                  <li>Get personalized household management solutions</li>
                  <li>Access premium features and services</li>
                  <li>Connect with professional home organizers</li>
                </ul>
              </div>
              
              <button onClick={handleLogin} className="login-button">
                Login
              </button>
            </div>
          </div>

          <div className="registration-content">
            <div className="registration-header">
              <h1>Customer Registration</h1>
              <p>Register yourself as a Customer with Household Management</p>
            </div>
            
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <div className="input-row">
                    <input 
                      type="text" 
                      name="firstName" 
                      placeholder="First Name" 
                      required 
                      onChange={handleChange}
                      className="form-input" 
                    />
                    <input 
                      type="text" 
                      name="lastName" 
                      placeholder="Last Name" 
                      required 
                      onChange={handleChange}
                      className="form-input" 
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Address <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="streetAddress1" 
                  placeholder="Street Address" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                />
                <input 
                  type="text" 
                  name="streetAddress2" 
                  placeholder="Street Address Line 2" 
                  onChange={handleChange}
                  className="form-input"
                />
                
                <div className="input-row">
                  <input 
                    type="text" 
                    name="city" 
                    placeholder="City" 
                    required 
                    onChange={handleChange}
                    className="form-input"
                  />
                  <input 
                    type="text" 
                    name="state" 
                    placeholder="State / Province" 
                    required 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <input 
                  type="text" 
                  name="postalCode" 
                  placeholder="Postal / Zip Code" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="(+91)0000000000" 
                  pattern="^(\+91[\-\s]?)?[6-9]\d{9}$" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="ex: email@yahoo.com" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
              required
              onChange={handleChange}
            />
            <small className="hint">Must contain at least 1 special character and a capital letter</small>
          </div>
              <button type="submit" className="submit-button">Register Account</button>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              
              <div className="login-link">
                Already have an account? <span onClick={() => navigate('/auth')} style={{color: '#29b6f6', cursor: 'pointer'}}>Sign in</span>
              </div>
            </form>
          </div>
        </div>
        
        <div className="wave-animation-registration"></div>
      </div>
    </div>
  );
}

export default RegistrationForm;