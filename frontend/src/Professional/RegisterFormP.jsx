import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tooltip } from "react-tooltip";
import "./RegisterFormP.css"; // Using the same CSS as customer registration

const RegisterFormP = () => {
  const navigate = useNavigate();
  const [workLocations, setWorkLocations] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNo: '',
    location: '',
    profession: '',
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/service-place");
        if (response.data) {
          setWorkLocations([...new Set(response.data.flatMap(item => item.places))]);
          setProfessions([...new Set(response.data.flatMap(item => item.services))]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    // Create FormData object for file uploads
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (file){
      formDataToSend.append("document", file);
    }

    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      // Send data to backend
      const response = await axios.post("http://localhost:5000/professional/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Registration successful:", response.data);
      setRedirect(true);  // Redirect on success

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed. Try again.");
    }
    
  };

  if (redirect) {
    return <Navigate to="/auth" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No file selected.");
      return;
    }

    const selectedFile = e.target.files[0];

    setFile(selectedFile);
    console.log("Selected file:", selectedFile);
    console.log("File type:", selectedFile.type);
    console.log("File size:", selectedFile.size, "bytes");
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleHome = () => {
    navigate("/"); // Navigate to home page
  };
  
  const handleLogin = () => {
    navigate("/auth"); // Navigate to login page
  };
  
  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="navigation-icons">
          <button 
            className="nav-icon back-icon" 
            onClick={handleBack}
            data-tooltip-id="back-tooltip"
            data-tooltip-content="Back to previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            className="nav-icon home-icon" 
            onClick={handleHome}
            data-tooltip-id="home-tooltip"
            data-tooltip-content="Go to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
        </div>

        <Tooltip id="back-tooltip" place="bottom" />
        <Tooltip id="home-tooltip" place="bottom" />
        <Tooltip id="login-tooltip" place="top" />

        <div className="registration-flex-container">
          <div className="info-panel">
            <div className="info-panel-content">
              <div className="info-panel-header">
                <svg className="info-panel-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <h2 className="info-title">Professional Services.</h2>
              </div>
              
              <div className="info-section">
                <h3>Why become a Professional Service Provider? 🧰</h3>
                <ul className="benefit-list">
                  <li>
                    <svg className="benefit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Connect with customers looking for your services</span>
                  </li>
                  <li>
                    <svg className="benefit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>Grow your business with our platform</span>
                  </li>
                  <li>
                    <svg className="benefit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                    <span>Access tools to manage your service offerings</span>
                  </li>
                  <li>
                    <svg className="benefit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                    <span>Build reputation through customer reviews</span>
                  </li>
                </ul>
              </div>
              
              <button 
              type="submit"
                onClick={handleLogin} 
                className="login-button"
                data-tooltip-id="login-tooltip"
                data-tooltip-content="Sign in to your account"
              >
                <svg className="login-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Login
              </button>
            </div>
          </div>

          <div className="registration-content">
            <div className="registration-header">
              <h1>Professional Registration</h1>
              <p>Register yourself as a Service Provider</p>
            </div>
            
            <form onSubmit={handleSubmit} className="registration-form">
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

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="example@example.com" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="form-input"
                />
                <small className="password-hint">Must contain at least 1 special character and capital letter</small>
              </div>

              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  name="phoneNo" 
                  placeholder="(+91) 0000000000" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <div className="dropdown">
                <label>Work Location <span className="required">*</span></label>
                <select 
                  name="location" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                  defaultValue=""
                >
                  <option value="" disabled>Please Select</option>
                  {workLocations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
                </div>
              </div>

              <div className="form-group">
                <div className="dropdown">
                <label>Select your profession <span className="required">*</span></label>
                <select 
                  name="profession" 
                  required 
                  onChange={handleChange}
                  className="form-input"
                  defaultValue=""
                >
                  <option value="" disabled>Please Select</option>
                  {professions.map((profession, index) => (
                    <option key={index} value={profession}>{profession}</option>
                  ))}
                </select>
              </div>
              </div>

              <div className="form-group">
                <label>Attach Verification Document <span className="required">*</span></label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="document"
                    id="fileInput"
                    className="form-input file-input"
                  />
                  {file && <p className="file-selected">Selected File: {file.name}</p>}
                  <small className="password-hint">Please include any attachments (e.g., .jpg, .pdf).</small>
                </div>
              </div>

              <button type="submit" className="submit-button">Register Account</button>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              
              <div className="login-link">
                Already have an account? <span onClick={handleLogin} style={{color: '#29b6f6', cursor: 'pointer'}}>Sign in</span>
              </div>
            </form>
          </div>
        </div>
        
        <div className="wave-animation-registration"></div>
      </div>
    </div>
  );
};

export default RegisterFormP;