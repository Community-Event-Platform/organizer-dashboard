import React from 'react'; 
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col about">
          <h4>About the website</h4>
          <p>An event management and networking platform for a community. Experience the thrill of exciting events and connect with like-minded people near you. Explore our <a href="#">About</a> page to learn more about us.</p>
          <div className="social-icons">
            <span className="social-icon"></span>
            <span className="social-icon"></span>
            <span className="social-icon"></span>
            <span className="social-icon"></span>
          </div>
        </div>

        <div className="footer-col links">
          <h4>Quick link</h4>
          <ul>
            <li><a href="#">Home page</a></li>
            <li><a href="#">Events managements</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Event attendee management</a></li>
            <li><a href="#">Updating...</a></li>
          </ul>
        </div>

        <div className="footer-col service">
          <h4>Service</h4>
          <ul>
            <li><a href="#">View My events</a></li>
            <li><a href="#">View all event registrants</a></li>
            <li><a href="#">Event Update</a></li>
            <li><a href="#">Updating...</a></li>
            <li><a href="#">Updating...</a></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <span className="icon">📍</span>
              No.123, ABC Street, Son Tra District, DaNang City
            </li>
            <li>
              <span className="icon">📞</span>
              (+84) 373 532 152
            </li>
            <li>
              <span className="icon">✉️</span>
              Eventorganizer123@projectadvanced.PNV.com
            </li>
            <li>
              <span className="icon">🕒</span>
              Monday - Saturday: <strong>8:00 - 17:00</strong>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 EventHub. All rights reserved.</p>
        <p>The Community Event Platform was developed by Group 5 of the Advanced Web project.</p>
      </div>
    </footer>
  );
};

export default Footer;
