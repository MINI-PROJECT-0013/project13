import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./ServiceResults.css";

function ServiceResults() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("userId");
    const service = searchParams.get("service");
    const location = searchParams.get("place");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [professionals, setProfessionals] = useState([]);
    const [formState, setFormState] = useState({ 
        comments: {}, 
        ratings: {}, 
        selectedProfessional: null, 
        complaint: "" 
    });

    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/list?id=${id}&service=${service}&location=${location}`);
                if (response.data.length === 0) {
                    setErrorMessage("No service providers found for this service in your location.");
                } else {
                    setProfessionals(response.data);
                    setErrorMessage("");
                }
            } catch (error) {
                console.error("Error fetching service providers", error);
                setErrorMessage("Failed to fetch service providers. Please try again.");
            }
            setLoading(false);
        };
        fetchServiceProviders();
    }, [id, service, location]);

    const handleRequest = (professional) => {
        setFormState((prev) => ({ ...prev, selectedProfessional: professional }));
    };

    const handleCommentChange = (professionalId, value) => {
        setFormState((prev) => ({
            ...prev,
            comments: { ...prev.comments, [professionalId]: value }
        }));
    };

    const handleCommentSubmit = async (professionalId) => {
        const userComment = formState.comments[professionalId];
        if (!userComment) {
            alert("Please enter a comment before submitting.");
            return;
        }
        try {
            await axios.post("http://localhost:5000/submit-comment", { professionalId, userId: id, comment: userComment });
            alert("Comment submitted successfully!");
            setFormState((prev) => ({ ...prev, comments: { ...prev.comments, [professionalId]: "" } }));
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert("Failed to submit comment.");
        }
    };

    const handleStarClick = async (professionalId, ratingValue) => {
        try {
            await axios.post("http://localhost:5000/submit-rating", { professionalId, userId: id, rating: ratingValue });
            alert("Rating submitted successfully!");
            setFormState((prev) => ({ ...prev, ratings: { ...prev.ratings, [professionalId]: ratingValue } }));
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating.");
        }
    };

    const handleSubmitComplaint = async () => {
        const { selectedProfessional, complaint } = formState;
        if (!selectedProfessional || !complaint) {
            alert("Please fill in all fields before submitting.");
            return;
        }
        try {
            await axios.post("http://localhost:5000/bookings", {
                professionalId: selectedProfessional._id,
                professionalEmail: selectedProfessional.email,
                professionalName: `${selectedProfessional.firstName} ${selectedProfessional.lastName}`,
                professionalPhone: selectedProfessional.phoneNo,
                complaint,
                userId: id,
                service
            });
            alert("Request sent!");
            setFormState((prev) => ({ ...prev, selectedProfessional: null, complaint: "" }));
        } catch (error) {
            console.error("Error sending request", error);
            alert("Error sending request. Please try again.");
        }
    };

    // VS Code Sidebar Component (integrated directly)
    const VSCodeSidebar = () => {
        const handleBack = () => {
            window.history.back();
        };

        const handleLogout = () => {
            console.log("Logging out...");
            // Add your logout logic here
            window.location.href = "/";
        };

        const navigate = (path) => {
            window.location.href = path;
        };

        return (
            <div className="vscode-sidebar">
                <div className="sidebar-top-buttons">
                    {/* Back Button */}
                    <div className="tooltip-container">
                        <button 
                            onClick={handleBack}
                            className="sidebar-button"
                            aria-label="Go back"
                        >
                            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <div className="tooltip tooltip-right">Back</div>
                    </div>
                    
                    {/* Home Button */}
                    <div className="tooltip-container">
                        <button 
                            onClick={() => navigate("/")}
                            className="sidebar-button"
                            aria-label="Home"
                        >
                            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                        </button>
                        <div className="tooltip tooltip-right">Home</div>
                    </div>
                    
                    {/* Services Button */}
                    <div className="tooltip-container">
                        <button 
                            onClick={() => navigate("/services")}
                            className="sidebar-button active"
                            aria-label="Services"
                        >
                            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="8" height="8" rx="1" />
                                <rect x="14" y="2" width="8" height="8" rx="1" />
                                <rect x="2" y="14" width="8" height="8" rx="1" />
                                <rect x="14" y="14" width="8" height="8" rx="1" />
                            </svg>
                        </button>
                        <div className="tooltip tooltip-right">Services</div>
                    </div>
                    
                    {/* Profile Button */}
                    <div className="tooltip-container">
                        <button 
                            onClick={() => navigate('/customer/profile/${userId}')}
                            className="sidebar-button"
                            aria-label="Profile"
                        >
                            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </button>
                        <div className="tooltip tooltip-right">Profile</div>
                    </div>
                </div>
                
                {/* Logout Button at bottom */}
                <div className="sidebar-bottom">
                    <div className="tooltip-container">
                        <button 
                            onClick={handleLogout}
                            className="sidebar-button"
                            aria-label="Logout"
                        >
                            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        </button>
                        <div className="tooltip tooltip-right">Logout</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="vscode-container">
            {/* Sidebar Component */}
            <VSCodeSidebar />
            
            {/* Main Content */}
            <div className="list-container">
                <h2>{service} Service Providers in {location}</h2>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading service providers...</p>
                    </div>
                ) : errorMessage ? (
                    <p className="error-message">{errorMessage}</p>
                ) : (
                    <ul className="professionals-list">
                        {professionals.map(pro => (
                            <li key={pro._id} className="professional-card">
                                <h3>{pro.firstName} {pro.lastName}</h3>
                                <p>Email: {pro.email}</p>
                                <p>Phone: {pro.phoneNo}</p>
                                <p>Rating: {pro.rating} ⭐</p>
                                <textarea
                                    className="comment-textarea"
                                    placeholder="Leave a comment"
                                    value={formState.comments[pro._id] || ""}
                                    onChange={(e) => handleCommentChange(pro._id, e.target.value)}
                                />
                                <div className="card-actions">
                                    <button 
                                        className="action-button comment-button" 
                                        onClick={() => handleCommentSubmit(pro._id)}
                                    >
                                        Submit Comment
                                    </button>
                                    <button 
                                        className="action-button request-button" 
                                        onClick={() => handleRequest(pro)}
                                    >
                                        Request
                                    </button>
                                </div>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            className={'star ${formState.ratings[pro._id] >= star ? "selected" : ""}'}
                                            onClick={() => handleStarClick(pro._id, star)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {formState.selectedProfessional && (
                    <div className="modal">
                        <h3>Submit Your Complaint for {formState.selectedProfessional.firstName} {formState.selectedProfessional.lastName}</h3>
                        <textarea
                            className="complaint-textarea"
                            placeholder="Describe your complaint"
                            value={formState.complaint}
                            onChange={(e) => setFormState(prev => ({ ...prev, complaint: e.target.value }))}
                        />
                        <div className="modal-actions">
                            <button 
                                className="action-button submit-button" 
                                onClick={handleSubmitComplaint}
                            >
                                Submit
                            </button>
                            <button 
                                className="action-button cancel-button" 
                                onClick={() => setFormState(prev => ({ ...prev, selectedProfessional: null, complaint: "" }))}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceResults;