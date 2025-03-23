import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import './CustomerProfile.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
        <div className="nav-title"> 
             CUSTOMER PROFILE
        </div>
      <div className="nav-links">
        <Link to='/search/:id' className="nav-home">
          back
        </Link>  
        <Link to='/' className="nav-link">
          logout
        </Link>
      </div>
    </nav>
  );
};

const ProfileC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [editedProfile, setEditedProfile] = useState({...profile});
  
  const [serviceHistory, setServiceHistory] = useState([]);
  const [refreshHistory, setRefreshHistory] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/customer/profile/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        const profileData = {
          firstName: data.FirstName || '',
          lastName: data.LastName || '',
          contact: data.phoneNo || '',
          email: data.email || '',
          address: data.address || '',
          city: data.City || '',
          state: data.State || '',
          zipCode: data.ZipCode || '',
        };
        setProfile(profileData);
        setEditedProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchServiceHistory = async () => {
      setIsLoading(true);
      try {
        // Fetch bookings data
        const bookingsResponse = await fetch(`http://localhost:5000/customer/service-history/${id}`);
        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings data');
        }
        const bookingsData = await bookingsResponse.json();
        
        // Process the bookings to ensure all data is available
        const enhancedBookings = await Promise.all(bookingsData.map(async (booking) => {
          try {
            // If professional is already populated with details, use them directly
            if (booking.professional && typeof booking.professional === 'object') {
              return {
                ...booking,
                professionalName: `${booking.professional.firstName} ${booking.professional.lastName}`,
                professionalContact: booking.professional.phoneNo || 'Not available',
                professionalEmail: booking.professional.email || 'Not available',
                professionalProfession: booking.professional.profession || 'Not specified',
                professionalLocation: booking.professional.location || 'Location not available'
              };
            }
            
            // Otherwise fetch professional details by ID
            if (booking.professional && typeof booking.professional === 'string') {
              const profResponse = await fetch(`http://localhost:5000/professional/profiles/${booking.professional}`);
              if (profResponse.ok) {
                const profData = await profResponse.json();
                return {
                  ...booking,
                  professionalName:' ${profData.FirstName} ${profData.LastName}',
                  professionalContact: profData.phoneNo || 'Not available',
                  professionalEmail: profData.email || 'Not available',
                  professionalProfession: profData.profession || 'Not specified',
                  professionalLocation: profData.address 
                    ? `${profData.address}${profData.City ? ', ' + profData.City : ''}${profData.State ? ', ' + profData.State : ''} `                : 'Location not available'
                };
              }
            }
            
            // Fallback to existing data if professional fetch fails
            return {
              ...booking,
              professionalName: booking.professionalName || 'Unknown',
              professionalContact: booking.professionalContact || 'Not available',
              professionalEmail: booking.professionalEmail || 'Not available',
              professionalProfession: booking.professionalProfession || 'Not specified',
              professionalLocation: booking.professionalLocation || 'Location not available'
            };
          } catch (error) {
            console.error('Error fetching professional data:', error);
            return booking;
          }
        }));
        
        setServiceHistory(enhancedBookings);
      } catch (error) {
        console.error('Error fetching service history:', error);
        setServiceHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    fetchServiceHistory();
  }, [id, refreshHistory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/customer/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: editedProfile.firstName,
          LastName: editedProfile.lastName,
          phoneNo: editedProfile.contact,
          email: editedProfile.email,
          address: editedProfile.address,
          City: editedProfile.city,
          State: editedProfile.state,
          ZipCode: editedProfile.zipCode,
        }),
      });
      
      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile({...profile});
    setIsEditing(false);
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/booking/update-status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });
      
      if (response.ok) {
        // Refresh the service history
        setRefreshHistory(prev => !prev);
        alert('Booking ${newStatus} successfully!');
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
  };

  // Ensure full name is correctly displayed even if data is loading or incomplete
  const fullName = profile.firstName && profile.lastName 
    ? `${profile.firstName} ${profile.lastName}`
    : profile.firstName || profile.lastName || 'Loading...';

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <div className="sidebar">
          <div className="profile-header">
            <h2>{fullName}</h2>
            <p className="user-emailc">{profile.email || 'No email available'}</p>
          </div>
          
          <div className="dashboard-menu">
            <button 
              className={`menu-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account Details
            </button>
            <button 
              className={`menu-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Service History
            </button>
          </div>
        </div>

        <div className="content">
          <div className="scrollable-content">
            {activeTab === 'account' ? (
              <div className="user-details-section">
                <div className="section-header">
                  <h3>Account Details</h3>
                  {!isEditing && (
                    <button className="edit-button" onClick={handleEdit}>
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  // Edit mode
                  <div className="edit-form">
                    <div className="form-group">
                      <label>First Name:</label>
                      <input 
                        type="text" 
                        name="firstName" 
                        value={editedProfile.firstName} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name:</label>
                      <input 
                        type="text" 
                        name="lastName" 
                        value={editedProfile.lastName} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>Email:</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={editedProfile.email} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number:</label>
                      <input 
                        type="text" 
                        name="contact" 
                        value={editedProfile.contact} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>Address:</label>
                      <input 
                        type="text" 
                        name="address" 
                        value={editedProfile.address} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>City:</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={editedProfile.city} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>State:</label>
                      <input 
                        type="text" 
                        name="state" 
                        value={editedProfile.state} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>Zip Code:</label>
                      <input 
                        type="text" 
                        name="zipCode" 
                        value={editedProfile.zipCode} 
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className="form-actions">
                      <button className="save-button" onClick={handleSave}>Save</button>
                      <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Full Name:</span>
                      <span className="detail-value">{fullName}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{profile.email || 'Not provided'}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Phone Number:</span>
                      <span className="detail-value">{profile.contact || 'Not provided'}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Address: </span>
                      <span className="detail-value">{profile.address || 'Not provided'}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">City: </span>
                      <span className="detail-value">{profile.city || 'Not provided'}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">State:</span>
                      <span className="detail-value">{profile.state || 'Not provided'}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Zip Code:</span>
                      <span className="detail-value">{profile.zipCode || 'Not provided'}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="service-history-section">
                <div className="section-header">
                  <h3>Service History</h3>
                  <button 
                    className="edit-button"
                    onClick={() => setRefreshHistory(prev => !prev)}
                  >
                    Refresh
                  </button>
                </div>
                
                {isLoading ? (
                  <div className="loading-indicator">
                    <p>Loading service history...</p>
                  </div>
                ) : serviceHistory.length > 0 ? (
                  <div className="service-history-list">
                    {serviceHistory.map((booking, index) => (
                      <div key={booking._id || index} className="service-card">
                        <div className="service-header">
                          <h4>{booking.serviceType || booking.service || 'Unknown Service'}</h4>
                          <span className="booking-date">{formatDate(booking.bookingDate || booking.date)}</span>
                        </div>
                        <div className="service-details">
                          <div className="professional-info">
                            <div className="detail-item">
                              <span className="detail-label">Professional:</span>
                              <span className="detail-value">{booking.professionalName || 'Not assigned'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Profession:</span>
                              <span className="detail-value">{booking.professionalProfession || 'Not specified'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Email:</span>
                              <span className="detail-value">{booking.professionalEmail || 'Not available'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone:</span>
                              <span className="detail-value">{booking.professionalContact || 'Not available'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Location:</span>
                              <span className="detail-value">{booking.professionalLocation || 'Location not available'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Status:</span>
                              <span className={`detail-value status-${(booking.status || 'pending').toLowerCase()}`}>
                                {booking.status || 'Pending'}
                              </span>
                            </div>
                            
                            {booking.notes && (
                              <div className="detail-item">
                                <span className="detail-label">Notes:</span>
                                <span className="detail-value notes">{booking.notes}</span>
                              </div>
                            )}
                            
                            {/* Add actions if the booking is pending */}
                            {booking.status === 'Pending' && (
                              <div className="booking-actions">
                                <button 
                                  className="cancel-button"
                                  onClick={() => updateBookingStatus(booking._id, 'Cancelled')}
                                >
                                  Cancel Booking
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-history">
                    <p>No service history found.</p>
                    <p>Once you book services, they will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileC;