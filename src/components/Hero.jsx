import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [events, setEvents] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch events from backend
    fetch('http://127.0.0.1:8000/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setEvents(data.data);
        }
      })
      .catch((err) => console.error('Error fetching events:', err));
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const currentEvent = events.length > 0 ? events[currentSlide] : null;

  return (
    <div className="hero-container">
      {/* Top Header Section */}
      <div className="hero-header">
        <h1>Chào mừng bạn đến với <br/><span className="text-green">Event organizer</span></h1>
        <p>
          Hi, bạn đang xem là website nhà cung cấp thông tin sự kiện. Ở đây bạn sẽ quản lý những sự kiện của bạn.<br/>
          Với các danh mục khác nhau, hãy xem phần giới thiệu thêm bên dưới và hãy đăng ký/đăng nhập để có trải nghiệm đầy đủ.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="hero-carousel">
        <div className="carousel-background" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
          <div className="carousel-overlay"></div>
        </div>
        
        {/* Carousel Controls */}
        <button className="carousel-btn prev" onClick={prevSlide}>
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="carousel-btn next" onClick={nextSlide}>
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Event Info */}
        <div className="carousel-content">
          {currentEvent ? (
            <>
              <span className="badge category-badge">{currentEvent.category?.name || 'Category'}</span>
              <h2 className="event-title">{currentEvent.name}</h2>
              <div className="event-meta">
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {currentEvent.location}
                </span>
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(currentEvent.event_date).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="badge category-badge">Sports</span>
              <h2 className="event-title">Giải bóng đá cộng đồng</h2>
              <div className="event-meta">
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Sân vận động Mỹ Đình
                </span>
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  25/05/2026
                </span>
              </div>
            </>
          )}
        </div>

        {/* Indicators */}
        <div className="carousel-indicators">
          {events.length > 0 ? events.map((_, idx) => (
            <span key={idx} className={`indicator ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)}></span>
          )) : (
            <>
              <span className="indicator active"></span>
              <span className="indicator"></span>
              <span className="indicator"></span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
