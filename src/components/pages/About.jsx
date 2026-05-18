import React from 'react';
import '../css/About.css';

/**
 * About Page Component
 * Renders the introductory information for organizers detailing how their events
 * are displayed on the user-facing attendee client. Includes an interactive mockup
 * browser shell of the attendee interface.
 */
const About = () => {
  return (
    <div className="about-wrapper animate-fadeIn">
      {/* Brand Green Banner */}
      <div className="about-banner">
        <div className="container">
          <h1 className="banner-title">Event của bạn sẽ xuất hiện như thế nào?</h1>
          <p className="banner-subtitle">
            Sự kiện của bạn sẽ được hiển thị trên nền tảng dành cho người dùng của EventHub,
            giúp bạn tiếp cận nhiều người tham gia hơn.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="about-container">
        <div className="container">
          <div className="about-card-wrapper">
            {/* Left Column - Details and Actions */}
            <div className="about-info-col">
              <h2 className="info-title">Event của bạn sẽ xuất hiện trên EventHub User</h2>
              <p className="info-desc">
                Tất cả sự kiện được tạo bởi organizer sẽ tự động hiển thị trên nền tảng dành cho người dùng của EventHub.
              </p>
              
              <h3 className="list-title">Người dùng có thể :</h3>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon-wrapper search-bg">
                    <i className="bi bi-search"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">Tìm kiếm sự kiện</h4>
                    <p className="feature-paragraph">Dễ dàng tìm thấy sự kiện phù hợp.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper eye-bg">
                    <i className="bi bi-eye"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">Xem thông tin chi tiết</h4>
                    <p className="feature-paragraph">Xem đầy đủ thông tin, thời gian, địa điểm, v.v.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper ticket-bg">
                    <i className="bi bi-ticket-perforated"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">Đăng ký tham gia</h4>
                    <p className="feature-paragraph">Đăng ký nhanh chóng và tiện lợi.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-wrapper people-bg">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-heading">Theo dõi hoạt động cộng đồng</h4>
                    <p className="feature-paragraph">Cập nhật các sự kiện và hoạt động mới nhất.</p>
                  </div>
                </div>
              </div>

              {/* Callout Box */}
              <div className="info-callout">
                <p>
                  EventHub giúp bạn kết nối với nhiều người tham gia hơn thông qua hệ thống quản lý và hiển thị sự kiện hiện đại.
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
                  Visit EventHub User Website <i className="bi bi-box-arrow-up-right ms-2"></i>
                </a>
                <p className="btn-helper-text">
                  <i className="bi bi-shield-check text-success me-2"></i> Trang web dành cho người dùng (mở trong tab mới)
                </p>
              </div>
            </div>

            {/* Right Column - Attendee UI Mockup */}
            <div className="about-mockup-col">
              {/* Browser mockup container */}
              <div className="browser-mockup">
                {/* Browser top title bar */}
                <div className="browser-title-bar">
                  <div className="browser-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="browser-address-bar">
                    <i className="bi bi-lock-fill"></i> localhost:5173
                  </div>
                </div>

                {/* Mockup webpage viewport */}
                <div className="mockup-viewport">
                  {/* Mock Navbar */}
                  <div className="mock-navbar">
                    <div className="mock-logo">
                      <i className="bi bi-lightning-charge-fill text-success"></i>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>EventHub</span>
                    </div>
                    <div className="mock-nav-links">
                      <span className="mock-link active-link">Home</span>
                      <span className="mock-link">Event</span>
                      <span className="mock-link">Contact</span>
                      <span className="mock-link">About</span>
                    </div>
                    <div className="mock-nav-buttons">
                      <span className="mock-btn-login">Login</span>
                      <span className="mock-btn-register">Register</span>
                    </div>
                  </div>

                  {/* Mock Hero Banner */}
                  <div className="mock-hero">
                    <h3>Sự kiện hàng đầu Dành cho bạn</h3>
                    <p>Khám phá và tham gia các sự kiện tuyệt vời nhất gần bạn. Nơi âm nhạc, công nghệ thể thao và nghệ thuật giao hòa</p>
                    <div className="mock-search-bar">
                      <span className="search-placeholder"><i className="bi bi-search text-muted me-2"></i> Tìm kiếm tên, địa điểm ...</span>
                      <span className="search-divider"></span>
                      <span className="search-placeholder">Danh mục <i className="bi bi-chevron-down ms-1 text-muted"></i></span>
                      <span className="search-divider"></span>
                      <span className="search-placeholder"><i className="bi bi-calendar3 text-muted me-2"></i> Ngày</span>
                    </div>
                  </div>

                  {/* Mock Events Section */}
                  <div className="mock-events-section">
                    <h4 className="section-title">Sự kiện hàng đầu</h4>
                    
                    <div className="mock-events-grid">
                      {/* Card 1: Music */}
                      <div className="mock-event-card">
                        <div className="mock-card-img music-img">
                          <span className="mock-badge badge-music">Music</span>
                        </div>
                        <div className="mock-card-body">
                          <h5>Summer Music Festival 2026</h5>
                          <p className="card-location"><i className="bi bi-geo-alt-fill me-1"></i> City Stadium</p>
                          <div className="card-meta">
                            <span className="card-price">50 spots left</span>
                            <span className="card-rating"><i className="bi bi-star-fill text-warning me-1"></i> 4.8</span>
                          </div>
                          <span className="mock-card-btn">View Details</span>
                        </div>
                      </div>

                      {/* Card 2: Sports */}
                      <div className="mock-event-card">
                        <div className="mock-card-img sports-img">
                          <span className="mock-badge badge-sports">Sports</span>
                        </div>
                        <div className="mock-card-body">
                          <h5>Community Sports Day</h5>
                          <p className="card-location"><i className="bi bi-geo-alt-fill me-1"></i> City Park</p>
                          <div className="card-meta">
                            <span className="card-price">30 spots left</span>
                            <span className="card-rating"><i className="bi bi-star-fill text-warning me-1"></i> 4.6</span>
                          </div>
                          <span className="mock-card-btn">View Details</span>
                        </div>
                      </div>

                      {/* Card 3: Food */}
                      <div className="mock-event-card">
                        <div className="mock-card-img food-img">
                          <span className="mock-badge badge-food">Food</span>
                        </div>
                        <div className="mock-card-body">
                          <h5>Food & Culture Fair</h5>
                          <p className="card-location"><i className="bi bi-geo-alt-fill me-1"></i> Downtown Plaza</p>
                          <div className="card-meta">
                            <span className="card-price">20 spots left</span>
                            <span className="card-rating"><i className="bi bi-star-fill text-warning me-1"></i> 4.9</span>
                          </div>
                          <span className="mock-card-btn">View Details</span>
                        </div>
                      </div>

                      {/* Card 4: Tech */}
                      <div className="mock-event-card">
                        <div className="mock-card-img tech-img">
                          <span className="mock-badge badge-tech">Community</span>
                        </div>
                        <div className="mock-card-body">
                          <h5>Tech Workshop Series</h5>
                          <p className="card-location"><i className="bi bi-geo-alt-fill me-1"></i> Innovation Hub</p>
                          <div className="card-meta">
                            <span className="card-price">15 spots left</span>
                            <span className="card-rating"><i className="bi bi-star-fill text-warning me-1"></i> 4.7</span>
                          </div>
                          <span className="mock-card-btn">View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Categories Bar */}
                  <div className="mock-categories-bar">
                    <h4>Browse by Category</h4>
                    <p>Find events that match your interests</p>
                    <div className="mock-cats-grid">
                      <span className="mock-cat-item"><i className="bi bi-music-note-beamed text-primary"></i> Music</span>
                      <span className="mock-cat-item"><i className="bi bi-dribbble text-success"></i> Sports</span>
                      <span className="mock-cat-item"><i className="bi bi-cup-hot text-warning"></i> Food</span>
                      <span className="mock-cat-item"><i className="bi bi-mortarboard text-info"></i> Education</span>
                      <span className="mock-cat-item"><i className="bi bi-people text-danger"></i> Community</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer pill */}
              <div className="disclaimer-banner">
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                Giao diện hiển thị có thể thay đổi theo thời gian để mang lại trải nghiệm tốt nhất cho người dùng.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
