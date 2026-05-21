import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col about">
          <h4>About</h4>
          <p>A community event management and connection platform. Experience the excitement of great events and connect with like-minded people near you. Visit our about page to learn more.</p>
          <div className="social-icons">
            <a href="#" className="social-icon fb"><i className="bi bi-facebook"></i></a>
            <a href="#" className="social-icon tw"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="social-icon ig"><i className="bi bi-instagram"></i></a>
            <a href="#" className="social-icon yt"><i className="bi bi-youtube"></i></a>
          </div>
        </div>

        <div className="footer-col links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Manage Events</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Manage Participants</a></li>
          </ul>
        </div>

        <div className="footer-col service">
          <h4>Services</h4>
          <ul>
            <li><a href="#">View My Events</a></li>
            <li><a href="#">View Registrations</a></li>
            <li><a href="#">Update Events</a></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <i className="bi bi-geo-alt-fill contact-icon"></i>
              No.123, ABC Street, Son Tra District, Da Nang City
            </li>
            <li>
              <i className="bi bi-telephone-fill contact-icon"></i>
              (+84) 373 532 152
            </li>
            <li>
              <i className="bi bi-envelope-fill contact-icon"></i>
              Eventorganizer123@projectadvanced.PNV.com
            </li>
            <li>
              <i className="bi bi-clock-fill contact-icon"></i>
              <span>Monday - Saturday: <strong>8:00 - 17:00</strong></span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">© 2026 EventHub. All rights reserved.</p>
        <p className="developed-by">A community event platform developed by Group 5 for the Advanced Web project.</p>
      </div>
    </footer>
  );
};

export default Footer;
