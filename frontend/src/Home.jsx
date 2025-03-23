import React, { useRef } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const supportRef = useRef(null);
  
  const goToLogin = () => {
    navigate('/auth');
  };
  const goToRegC = () => {
    navigate('/customer/register');
  };
  const goToRegP = () => {
    navigate('/professional/register');
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <div className="Bar">
        
        <div className="button-container">
          <button onClick={goToLogin} className="contact-button" style={{ backgroundColor: "rgba(6,1,39,1)", color: 'whitesmoke' }}>Login</button>
          <button onClick={() => scrollToSection(aboutRef)} className="about-button" style={{ backgroundColor: "rgba(6,1,39,1)", color: 'whitesmoke' }}>About</button>
          <button onClick={() => scrollToSection(supportRef)} className="nav-button1" style={{ backgroundColor: "rgba(6,1,39,1)", color: 'whitesmoke' }}>Customer Support</button>
         
          
        </div>
      </div>

      <header className="hero">
        <img src="/image2.png" alt="Hero" className="hero-picture" />
        <div className="hero-content">
          <h1>WELCOME TO DomSev</h1>
        </div>
      </header>

      <section className="services">
        <div className="service-card">
          <div className="service-img">
            <img src="/customer_17819433.png" alt="customer" className="size" />
            <h3>Register as<br /> Customer</h3>
            <p>Are you one looking for a service? Don't hesitate!</p>
            <button onClick={goToRegC} className="b">Register</button>
          </div>
        </div>
        <div className="service-card">
          <div>
            <img src="/best-employee_18239678.png" alt="professional" className="size" />
            <h3>Register as Professional</h3>
            <p>Are you planning to start a professional work?</p>
            <button onClick={goToRegP} className="b">Register</button>
          </div>
        </div>
      </section>

      {/* About Section at Bottom */}
      <section ref={aboutRef} className="about-container">
       {/*  <div className="about-content"> */}
          <h3>About Us</h3>
          <p>
            At Household Service, we redefine home management by seamlessly connecting you with skilled and trusted professionals for all your household needs, from plumbing and cleaning to repairs and maintenance. Our platform makes it effortless to explore and compare service providers through detailed ratings and reviews. With intuitive real-time booking, scheduling your services takes just a few clicks. Clear, direct communication with providers ensures transparency, while verified reviews build trust and confidence. Designed for accessibility across all devices, our platform is fast, reliable, and user-friendly. Whether you're a homeowner in need of support or a professional offering services, Household Service is here to simplify and enhance your experience. Join us today and let us take the hassle out of managing your home!
          </p>
       {/*  </div> */}
      </section>
      {/* Customer Support Section */}
      <section ref={supportRef} className="support-section">
        <h3>Customer Support</h3>
        <p>We’re here to assist you 24/7.</p>
        <p><strong>Email:</strong> support@domsev.com</p>
        <p><strong>Phone:</strong> +1 800-123-4567</p>
        </section>
<section >
  <h3> Services we offer</h3>
  
<button class="offerButton" style={{ backgroundColor:"lightgray",color:"black"}}> Plumbing Services </button>

<button class="offerButton"> Electrical Services </button>

<button class="offerButton"> House Cleaning </button>

<button class="offerButton"> Gardening Services </button>

<button class="offerButton"> Painting Services </button>

<button class="offerButton"> Appliance Repair </button>

<button class="offerButton"> Pest Control Services </button>

<button class="offerButton"> Carpentry Services </button>

<button class="offerButton"> Home Security Services </button>

<button class="offerButton"> AC Maintenance </button>

</section>
      

    </div>
  );
}

export default Home;