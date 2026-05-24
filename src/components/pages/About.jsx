import homepageImg from '../../assets/About/homepage.png';
import '../css/About.css';

/**
 * About Page Component
 * Renders the introductory information for organizers detailing how their events
 * are displayed on the user-facing attendee client. Includes a browser shell mockup
 * rendering the static attendee homepage image.
 */
const About = () => {
  return (
    <div className="about-wrapper animate-fadeIn">
      {/* Brand Green Banner */}
      <div className="about-banner">
        <div className="container">
          <h1 className="banner-title">How will your event appear?</h1>
          <p className="banner-subtitle">
            Your event will be displayed on the EventHub user platform, helping you reach more attendees.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="about-container">
        <div className="container">
          <div className="about-card-wrapper">
            {/* Left Column - Details and Actions */}
            <div className="about-info-col">
<h2 className="info-title">Your event will appear on EventHub User</h2>
              <p className="info-desc">
                All events created by organizers will automatically appear on the EventHub user platform.
              </p>
               
              <h3 className="list-title">Users can:</h3>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon-wrapper search-bg">
                    <i className="bi bi-search"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">Search events</h4>
                    <p className="feature-paragraph">Easily find the right event.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper eye-bg">
                    <i className="bi bi-eye"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">View details</h4>
                    <p className="feature-paragraph">See full information, time, location, and more.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper ticket-bg">
                    <i className="bi bi-ticket-perforated"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">Register to attend</h4>
                    <p className="feature-paragraph">Register quickly and easily.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper people-bg">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">Follow community activity</h4>
                    <p className="feature-paragraph">Stay updated on the latest events and activities.</p>
                  </div>
                </div>
              </div>

              {/* Callout Box */}
              <div className="info-callout">
                <p>
                  EventHub helps you connect with more attendees through a modern event management and display system.
                </p>
              </div>

              {/* Action Button */}
              <div className="action-button-group">
                <a 
                  href="http://localhost:5173" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-visit-user"
                >
                  Visit EventHub User <i className="bi bi-box-arrow-up-right ms-2"></i>
                </a>
                <p className="btn-helper-text">
                  <i className="bi bi-shield-check text-success me-2"></i> User website (opens in a new tab)
                </p>
              </div>
            </div>

            {/* Right Column - Attendee UI Mockup */}
            <div className="about-mockup-col">
              {/* Chrome style browser mockup container */}
              <div className="browser-mockup chrome-browser">
                {/* Chrome Window Tabs Header */}
                <div className="chrome-tabs-bar">
                  <div className="chrome-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="chrome-tabs">
                    <div className="chrome-tab active-tab">
                      <i className="bi bi-lightning-charge-fill text-success me-1"></i>
                      <span className="tab-title">EventHub</span>
                      <i className="bi bi-x tab-close"></i>
                    </div>
                    <div className="chrome-tab-new">
                      <i className="bi bi-plus"></i>
                    </div>
                  </div>
                </div>

                {/* Chrome Address Bar / Toolbar */}
                <div className="chrome-toolbar">
                  <div className="chrome-nav-buttons">
                    <i className="bi bi-arrow-left"></i>
                    <i className="bi bi-arrow-right"></i>
                    <i className="bi bi-arrow-clockwise"></i>
                  </div>
                  <div className="chrome-address-bar">
                    <div className="chrome-address-left">
                      <i className="bi bi-shield-fill-check text-success me-1"></i>
                      <span className="address-text">http://eventhub/user.com</span>
                    </div>
                    <i className="bi bi-star"></i>
                  </div>
                  <div className="chrome-menu">
                    <i className="bi bi-three-dots-vertical"></i>
                  </div>
                </div>

                {/* Mockup webpage viewport rendering the static image */}
                <div className="mockup-viewport image-viewport">
                  <img src={homepageImg} alt="EventHub User Website Mockup" className="mockup-img" />
                </div>
              </div>

              {/* Disclaimer pill */}
              <div className="disclaimer-banner">
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                The display interface may change over time to provide the best user experience.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
