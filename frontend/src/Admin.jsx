import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-title">ADMIN</div>
      <div className="nav-links">
      <Link to="/" className="nav-link">
          back
        </Link>
        <Link to="/login" className="nav-link">
          Logout
        </Link>
      </div>
    </nav>
  );
};

const Admin = () => {
  const [activeSection, setActiveSection] = useState("professionals");
  const [professionals, setProfessionals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [places, setPlaces] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);
  const [newService, setNewService] = useState({
    serviceName: "",
    description: "",
    category: "",
    price: ""
  });
  const [newPlace, setNewPlace] = useState({
    placeName: "",
    location: "",
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch professionals
        const proResponse = await fetch("http://localhost:5000/professional/profiles");
        const proData = await proResponse.json();
        setProfessionals(proData);
        
        // Fetch customers
        const custResponse = await fetch("http://localhost:5000/customer/profiles");
        const custData = await custResponse.json();
        setCustomers(custData);
        
        // Fetch services
        const response = await fetch("http://localhost:5000/admin/service-place");
        const data = await response.json();

        if (data.length > 0) {
          setServices(data[0]?.services || []); // ✅ Store services
          setPlaces(data[0]?.places?.map(place => ({ placeName: place })) || []);
        }

        console.log("Fetched services:", data[0]?.services || []);
        console.log("Fetched places:", data[0]?.places || []);
        
        // Fetch service history
        const historyResponse = await fetch("http://localhost:5000/admin/service-history");
        const historyData = await historyResponse.json();
        setServiceHistory(historyData || []);
        
        // Fetch ratings and reviews
        const ratingsResponse = await fetch("http://localhost:5000/ratings");
        const ratingsData = await ratingsResponse.json();
        setRatings(ratingsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteProfessional = async (professionalId) => {
    if (window.confirm("Are you sure you want to delete this professional?")) {
      try {
        const response = await fetch(`http://localhost:5000/professional/profiles/${professionalId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          setProfessionals(professionals.filter(pro => pro._id !== professionalId));
          alert("Professional deleted successfully");
        } else {
          alert("Failed to delete professional");
        }
      } catch (error) {
        console.error("Error deleting professional:", error);
        alert("Error deleting professional");
      }
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(`http://localhost:5000/customer/profiles/${customerId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          setCustomers(customers.filter(cust => cust._id !== customerId));
          alert("Customer deleted successfully");
        } else {
          alert("Failed to delete customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Error deleting customer");
      }
    }
  };

  const handleDeleteService = async (service) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch("http://localhost:5000/admin/delete-service-place", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ service }),
        });
  
        if (response.ok) {
          setServices(services.filter(s => s !== service));
          alert("Service deleted successfully");
        } else {
          alert("Failed to delete service");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service");
      }
    }
  };
  

  const handleDeletePlace = async (place) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        const response = await fetch("http://localhost:5000/admin/delete-service-place", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ place }),
        });
  
        if (response.ok) {
          setPlaces(places.filter(p => p !== place));
          alert("Place deleted successfully");
        } else {
          alert("Failed to delete place");
        }
      } catch (error) {
        console.error("Error deleting place:", error);
        alert("Error deleting place");
      }
    }
  };
  

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/admin/add-service-place", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service: newService.serviceName }),
      });
      
      if (response.ok) {
        const addedService = await response.json();
        setServices([...services, newService.serviceName]);
        setNewService({ serviceName: "", description: "", category: "", price: "" });
        setShowAddServiceForm(false);
        alert("Service added successfully");
      } else {
        alert("Failed to add service");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Error adding service");
    }
  };  

  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/admin/add-service-place", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place: newPlace.placeName }),
      });
  
      if (response.ok) {
        const addedPlace = await response.json();
        setPlaces([...places, newPlace.placeName]);
        setNewPlace({ placeName: "", location: "", description: "" });
        setShowAddPlaceForm(false);
        alert("Place added successfully");
      } else {
        alert("Failed to add place");
      }
    } catch (error) {
      console.error("Error adding place:", error);
      alert("Error adding place");
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Improved function to prepare professionals monthly registration data
  const prepareProfessionalsMonthlyData = () => {
    // Create an object to store counts by year-month
    const monthlyData = {};
    
    // Month names for display
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Process each professional's registration date
    professionals.forEach(pro => {
      if (pro.createdAt) {
        const date = new Date(pro.createdAt);
        // Create a sortable key in format "YYYY-MM" for proper chronological sorting
        const sortKey =` ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        // Create a display label
        const displayLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        if (!monthlyData[sortKey]) {
          monthlyData[sortKey] = {
            month: displayLabel,
            count: 0,
            sortKey // Keep the sort key for sorting later
          };
        }
        
        monthlyData[sortKey].count += 1;
      }
    });
    
    // Convert to array and sort chronologically
    let result = Object.values(monthlyData)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    
    // If no data available, create sample data for demonstration
    if (result.length === 0) {
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const month = new Date();
        month.setMonth(today.getMonth() - i);
        
        const sortKey =` ${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        const displayLabel = `${monthNames[month.getMonth()]} ${month.getFullYear()}`;
        
        // Random count between 5 and 20 for demo purposes
        const randomCount = Math.floor(Math.random() * 16) + 5;
        
        result.push({
          month: displayLabel,
          count: randomCount,
          sortKey
        });
      }
      
      // Sort the sample data
      result = result.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }
    
    // Get the last 12 months of data or all if less than 12
    if (result.length > 12) {
      result = result.slice(-12);
    }
    
    // Remove sortKey before returning
    return result.map(({ month, count }) => ({ month, count }));
  };

  // Prepare data for ratings chart
  const prepareRatingsData = () => {
    const ratingsByProfessional = {};
    
    ratings.forEach(rating => {
      if (!ratingsByProfessional[rating.professionalId]) {
        const professional = professionals.find(p => p._id === rating.professionalId);
        const name = professional ?` ${professional.firstName} ${professional.lastName} `: 'Unknown';
        
        ratingsByProfessional[rating.professionalId] = {
          name: name,
          avgRating: 0,
          totalRatings: 0,
          sumRatings: 0
        };
      }
      
      ratingsByProfessional[rating.professionalId].sumRatings += rating.rating;
      ratingsByProfessional[rating.professionalId].totalRatings += 1;
    });
    
    // Calculate average ratings
    Object.keys(ratingsByProfessional).forEach(proId => {
      ratingsByProfessional[proId].avgRating = 
        ratingsByProfessional[proId].sumRatings / ratingsByProfessional[proId].totalRatings;
    });
    
    return Object.values(ratingsByProfessional).map(item => ({
      name: item.name,
      rating: item.avgRating,
      totalReviews: item.totalRatings
    }));
  };

  // Colors for the bar chart
  const barColors = ['#4CAF50', '#3F9142', '#2E8034', '#1D6F26', '#0C5E18'];

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <div className="admin-dashboard">
          {/* Sidebar Navigation */}
          <div className="sidebar">
            <button 
              onClick={() => setActiveSection("professionals")}
              className={activeSection === "professionals" ? "active" : ""}
            >
              Professionals
            </button>
            <button 
              onClick={() => setActiveSection("customers")}
              className={activeSection === "customers" ? "active" : ""}
            >
              Customers
            </button>
            <button 
              onClick={() => setActiveSection("services")}
              className={activeSection === "services" ? "active" : ""}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveSection("places")}
              className={activeSection === "places" ? "active" : ""}
            >
              Places
            </button>
            <button 
              onClick={() => setActiveSection("serviceHistory")}
              className={activeSection === "serviceHistory" ? "active" : ""}
            >
              Service History
            </button>
            <button 
              onClick={() => setActiveSection("ratings")}
              className={activeSection === "ratings" ? "active" : ""}
            >
              Reviews & Ratings
            </button>
          </div>

          {/* Main Content Area */}
          <div className="content scrollable-content">
            {/* Professionals Section */}
            {activeSection === "professionals" && (
              <div className="user-list">
                <h3>Registered Professionals</h3>
                {professionals.length > 0 ? (
                  professionals.map((pro, index) => (
                    <div key={index} className="user-item">
                      <button 
                        className="delete-admin"
                        onClick={() => handleDeleteProfessional(pro._id)}
                        aria-label={Delete ${pro.firstName} ${pro.lastName}}
                      >
                        Delete
                      </button>
                      <div className="detail-row">
                        <span className="detail-label">Full Name:</span>
                        <span className="detail-value">{pro.firstName} {pro.lastName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{pro.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{pro.phoneNo}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Profession:</span>
                        <span className="detail-value">{pro.profession}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Work Location:</span>
                        <span className="detail-value">{pro.location}</span>
                      </div>
                      <div className="attachments-section">
                        <h4>Attached Documents</h4>
                        {pro?.document ? (
                          <div className="attachments-list">
                            {Array.isArray(pro.document) ? (
                              pro.document.map((file, index) => (
                                <div key={index} className="file-item">
                                  <a
                                    href={file.document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="download-button"
                                  >
                                    View
                                  </a>
                                </div>
                              ))
                            ) : (
                              <a
                                href={pro.document}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="download-button"
                              >
                                View
                              </a>
                            )}
                          </div>
                        ) : (
                          <p className="no-files">No files attached</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No professionals registered yet.</p>
                )}
              </div>
            )}

            {/* Customers Section */}
            {activeSection === "customers" && (
              <div className="user-list">
                <h3>Registered Customers</h3>
                {customers.length > 0 ? (
                  customers.map((cust, index) => (
                    <div key={index} className="user-item">
                        <button 
                        className="delete-admin"
                        onClick={() => handleDeleteCustomer(cust._id)}
                        aria-label={Delete ${cust.FirstName} ${cust.LastName} }
                      >
                        Delete
                      </button>

                      <div className="detail-row">
                        <span className="detail-label">Full Name:</span>
                        <span className="detail-value">{cust.FirstName} {cust.LastName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{cust.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{cust.phoneNo}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{cust.address}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">City:</span>
                        <span className="detail-value">{cust.City}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">State:</span>
                        <span className="detail-value">{cust.State}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">ZipCode:</span>
                        <span className="detail-value">{cust.ZipCode}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No customers registered yet.</p>
                )}
              </div>
            )}

            {/* Services Section */}
            {activeSection === "services" && (
              <div className="services-section">
                <h3>Services</h3>
                <button 
                  className="add-btn"
                  onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                >
                  {showAddServiceForm ? "Cancel" : "Add New Service"}
                </button>
                
                {showAddServiceForm && (
                  <div className="add-service-form">
                    <h4>Add New Service</h4>
                    <form onSubmit={handleAddService}>
                      <div className="form-group">
                        <label htmlFor="serviceName">Service Name:</label>
                        <input 
                          type="text" 
                          id="serviceName"
                          value={newService.serviceName}
                          onChange={(e) => setNewService({...newService, serviceName: e.target.value})}
                          required
                        />
                      </div>
                      <button type="submit" className="submit-btn">Add Service</button>
                    </form>
                  </div>
                )}
                
                {services.length > 0 ? (
                  services.map((service, index) => (
                    <div key={index} className="service-item">
                      <button 
                        className="delete-admin"
                        onClick={() => handleDeleteService(service)}
                        aria-label={Delete ${service} service}
                      >
                        Delete
                      </button>
                      <div className="detail-row">
                        <span className="detail-label">Service Name:</span>
                        <span className="detail-value">{service}</span>
                      </div>
                      <div className="registered-professionals">
                        <h4>Registered Professionals</h4>
                        {service.professionals && service.professionals.length > 0 ? (
                          service.professionals.map((proId, idx) => {
                            const professional = professionals.find(p => p._id === proId);
                            return professional ? (
                              <div key={idx} className="pro-item">
                                <span>{${professional.firstName} ${professional.lastName}}</span>
                                <button 
                                  className="remove-btn"
                                  onClick={() => {
                                    // Implement remove professional from service functionality
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : null;
                          })
                        ) : (
                          <p className="no-data">No professionals registered for this service.</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No services available.</p>
                )}
              </div>
            )}
            
            {/* Places Section */}
            {activeSection === "places" && (
              <div className="places-section">
                <h3>Places</h3>
                <button 
                  className="add-btn"
                  onClick={() => setShowAddPlaceForm(!showAddPlaceForm)}
                >
                  {showAddPlaceForm ? "Cancel" : "Add New Place"}
                </button>
                
                {showAddPlaceForm && (
                  <div className="add-place-form">
                    <h4>Add New Place</h4>
                    <form onSubmit={handleAddPlace}>
                      <div className="form-group">
                        <label htmlFor="placeName">Place Name:</label>
                        <input 
                          type="text" 
                          id="placeName"
                          value={newPlace.placeName}
                          onChange={(e) => setNewPlace({...newPlace, placeName: e.target.value})}
                          required
                        />
                      </div>
                      <button type="submit" className="submit-btn">Add Place</button>
                    </form>
                  </div>
                )}
                
                {places.length > 0 ? (
                  places.map((place, index) => (
                    <div key={index} className="place-item">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeletePlace(place.placeName)}
                      >
                        Delete
                      </button>
                      <div className="detail-row">
                        <span className="detail-label">Place Name:</span>
                        <span className="detail-value">{place.placeName}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No places available.</p>
                )}
              </div>
            )}

            {/* Service History Section */}
            {activeSection === "serviceHistory" && (
              <div className="service-history-section">
                <h3>Service History Tracking</h3>
                
                {serviceHistory.length > 0 ? (
                  <div className="history-list">
                    {serviceHistory.map((history, index) => {
                      const professional = history.professional; 
                      const customer = history.customer;
                      const service = services.find(s => s._id === history.service);
                      
                      return (
                        <div key={index} className="history-item">
                          <div className="detail-row">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{formatDate(history.date)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Service:</span>
                            <span className="detail-value">{history.service || 'Unknown Service'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Professional:</span>
                            <span className="detail-value">
                              {professional ? ${professional.firstName} ${professional.lastName} : 'Unknown Professional'}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Customer:</span>
                            <span className="detail-value">
                              {customer ? ${customer.FirstName} ${customer.LastName} : 'Unknown Customer'}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{history.location}</span>
                          </div>
                          {history.notes && (
                            <div className="detail-row">
                              <span className="detail-label">Notes:</span>
                              <span className="detail-value">{history.notes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-data">No service history available.</p>
                )}
              </div>
            )}

            {/* Ratings and Reviews Section */}
            {activeSection === "ratings" && (
              <div className="ratings-section">
                <h3>Professional Reviews & Ratings</h3>
                
                {/* Improved professionals registration chart */}
                <div className="registration-chart">
                  <h4>Professionals Registration by Month</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepareProfessionalsMonthlyData()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70}
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis 
                        label={{ 
                          value: 'Number of Registrations', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }} 
                        allowDecimals={false}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} Registration(s)`, 'Count']}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{ backgroundColor: 'white', borderRadius: '5px' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar 
                        dataKey="count" 
                        name="Professionals Registered" 
                        barSize={30}
                        radius={[4, 4, 0, 0]} // Rounded top corners
                      >
                        {
                          prepareProfessionalsMonthlyData().map((entry, index) => (
                            <Cell 
                              key={cell-${index}} 
                              fill={barColors[index % barColors.length]} 
                            />
                          ))
                        }
                        <LabelList 
                          dataKey="count" 
                          position="top" 
                          style={{ fill: '#333', fontSize: 12, fontWeight: 'bold' }} 
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="ratings-chart">
                  <h4>Average Ratings of Professional</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepareRatingsData()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis domain={[0, 5]} label={{ value: 'Rating (0-5)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rating" fill="#8884d8" name="Average Rating" />
                      <Bar dataKey="totalReviews" fill="#82ca9d" name="Total Reviews" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="reviews-list">
                  <h4>Recent Reviews</h4>
                  {ratings.length > 0 ? (
                    ratings.map((review, index) => {
                      const professional = professionals.find(p => p._id === review.professionalId);
                      const customer = customers.find(c => c._id === review.customerId);
                      
                      return (
                        <div key={index} className="review-item">
                          <div className="detail-row">
                            <span className="detail-label">Professional:</span>
                            <span className="detail-value">
                              {professional ? ${professional.firstName} ${professional.lastName} : 'Unknown Professional'}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Customer:</span>
                            <span className="detail-value">
                              {customer ? ${customer.firstName} ${customer.lastName} : 'Unknown Customer'}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Rating:</span>
                            <span className="detail-value">
                              {Array(5).fill().map((_, i) => (
                                <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                              ))}
                              {` (${review.rating}/5)`}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{formatDate(review.date)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Comment:</span>
                            <span className="detail-value">{review.comment}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-data">No reviews available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;