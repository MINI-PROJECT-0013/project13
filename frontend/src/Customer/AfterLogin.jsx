// AfterLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import './AfterLogin.css';

function AfterLogin() {
  const userId = useParams().userId || localStorage.getItem("userId");
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/service-place");
        console.log("API Response:", response.data);
        setServices(response.data[0]?.services || []);
        setPlaces(response.data[0]?.places || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter(service =>
    service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceRequest = (serviceName) => {
    if (!selectedPlace || !serviceName) {
      setError("Please select a place and service to proceed.");
      return;
    } else {
      setError("");
      console.log("Navigating to:",' /list?service=${serviceName}&place=${selectedPlace}&userId=${userId}');
      navigate('/list?service=${serviceName}&place=${selectedPlace}&userId=${userId}');
    }
  };

  const goToLogin = () => {
    navigate('/auth');
  };

  const goToProfile = () => {
    navigate('/customer/profile/${userId}');
  };

  // Function to generate a slightly different background color for each card
  const getCardColor = (index) => {
    const baseColor = '#2c3e50'; // Dark blue-gray base
    const hue = (index * 10) % 30; // Small hue variation
    return 'hsl(${210 + hue}, 30%, ${20 + (index % 5) * 2}%)';
  };

  return (
    <div className="afterlogin-page-container">
      {/* Top Navigation Bar */}
      <div className="afterlogin-nav">
        <div className="nav-left">
          <h1 className="site-title">HOUSEHOLD SERVICE MANAGEMENT</h1>
        </div>
        
        {/* Google-like Search Bar */}
        <div className="nav-right">
          <button onClick={goToProfile} className="profile-btn">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </button>
          <button onClick={goToLogin} className="logout-btn">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        <div className="welcome-section">
          <h2>Welcome</h2>
          <p>You have successfully logged in. Search or select services below.</p>
          
          <div className="dropdown-search-container">
            <div className="dropdown-container">
              <label htmlFor="place-select">Select Place:</label>
              <select
                id="place-select"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
              >
                <option value="">All Places</option>
                {places.map((place, index) => (
                  <option key={index} value={place}>{place}</option>
                ))}
              </select>
            </div>
            <div className="{'google-search-bar ${isFocused ? 'focused' : ''}'}">
          <div className="search-icon left">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div>
          <input
            type="text"
            placeholder="Search for community services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input"
          />
          </div>
          {searchQuery && (
            <div className="search-icon right clear" onClick={() => setSearchQuery("")}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          )}
          
        </div>
        
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Service Cards - renamed to avoid conflicts */}
        <div className="afterlogin-services-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <div 
                key={index} 
                className="afterlogin-service-item"
                style={{ backgroundColor: getCardColor(index) }}
              >
                <h3>{service}</h3>
                <button 
                  className="request-btn" 
                  onClick={() => handleServiceRequest(service)}
                >
                  Request {service} Service
                </button>
              </div>
            ))                                                                                                                                                                                                                                                                  
          ) : (
            <p className="no-results">No services found based on your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AfterLogin;