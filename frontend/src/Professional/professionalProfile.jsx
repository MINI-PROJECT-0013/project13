import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './professionalProfile.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-title">PROFILE</div>
      <div className="nav-links">
        {/* <Link to="/Home" className="nav-link">Home</Link> */}
        <Link to='/auth'className="nav-link">
          Logout
        </Link>
      </div>
    </nav>
  );
};

const Profile = () => {
  const {id} = useParams();
  const [profile, setProfile] = useState({
    photo: '',
    name: '',
    username: '',
    password: '',
    contact: '',
    email: '',
    profession: '',
    workLocation: '',
    document: '' // Array of attached files
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/professional/profile/${id}`); // Replace with your API endpoint
        const data = await response.json();
        setProfile({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phoneNo,
          location: data.location,
          profession: data.profession,
          document: data.document,
          rating: data.rating,
          ratings: data.ratings,
          comment: data.comment 
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, [id]);

  /* const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword); */

  
  return (
    <div>
      <Navbar />
      <div className="main-content">
        {/* <div className="sidebar">
          <div className="profile-header">
            <img
              src={profile.photo || "https://via.placeholder.com/120"}
              alt="Profile"
              className="profile-image"
              onClick={() => alert('Change profile photo')}
            />
            <div className="status-dot"></div>
            <h2>{profile.name}</h2>
            <p>{profile.username}</p>
            <button className="edit-btn">✎</button>
          </div>

          <div className="profile-details">
            <div className="detail">
              <span className="icon">👤</span>
              <span className="label">Username:</span>
              <span className="value">{profile.username}</span>
            </div>
            <div className="detail">
              <span className="icon">📞</span>
              <span className="label">Contact:</span>
              <span className="value">{profile.contact}</span>
            </div>
            <div className="detail">
              <span className="icon">✉</span>
              <span className="label">Email:</span>
              <span className="value">{profile.email}</span>
            </div>
            <div className="detail">
              <span className="icon">💼</span>
              <span className="label">Profession:</span>
              <span className="value">{profile.profession}</span>
            </div>
          </div>
        </div> */}

        <div className="content">
          <div className="scrollable-content">
          <div className="user-details-section">
            <h3>Account Details</h3>
            
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{profile.name}</span>
            </div>

            {/* <div className="detail-row password-field">
              <span className="detail-label">Password:</span>
              <span className="detail-value">
                {showPassword ? profile.password : ''}
                <button 
                  onClick={togglePasswordVisibility}
                  className="toggle-password"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </div> */}

            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{profile.email}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{profile.phone}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Work Location:</span>
              <span className="detail-value">{profile.location}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Profession:</span>
              <span className="detail-value">{profile.profession}</span>
            </div>

            <div className="attachments-section">
              <h4>Attached Documents</h4>
              {profile?.document? (
                <div className="attachments-list">
                      <a
                        href={profile.document}
                        target="_blank" rel="noopener noreferrer" className="download-button">
                        View
                      </a>
                    </div>
              ) : (
                <p className="no-files">No files attached</p>
              )}
            </div>
          </div>
          </div>

          <div className="footer">
    <div className="footer-content">
        <div className="reviews-section">
            <h4>Customer Reviews ({profile.ratings?.length || 0})</h4>

            <div className="average-rating">
                <span>Average Rating: {profile.rating ? profile.rating.toFixed(1) : "N/A"}</span>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`star ${Math.round(profile.rating || 0) >= star ? "selected" : ""}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            {profile.ratings?.length > 0 ? (
                <div className="reviews-list">
                    {profile.ratings.slice(-3).reverse().map((rating, index) => (
                        <div key={index} className="review-item">
                            <div className="review-header">
                                <span className="reviewer-name">{rating.customerName || "Anonymous"}</span>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span 
                                            key={star} 
                                            className={`star ${rating.rating >= star ? "selected" : ""}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">{profile.comment?.[index] || "No comment provided"}</p>
                            <span className="review-date">
                                {new Date(rating.date).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-reviews">No reviews yet</p>
            )}
        </div>
    </div>
</div>

          </div>
        </div>
        
      </div>
      /* </div> */
  );
};

export default Profile;