import { useState, useEffect } from 'react';
import '../css/Hero.css';

// Import local slide images
import slide1 from '../../assets/slides/slide1.png';
import slide2 from '../../assets/slides/slide2.png';
import slide3 from '../../assets/slides/slide3.png';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: slide1,
      category: 'Music',
      title: 'EDM Music Festival 2026',
      location: 'Military Region 7 Stadium',
      date: '20/06/2026'
    },
    {
      id: 2,
      image: slide2,
      category: 'Technology',
      title: 'AI & Future Conference',
      location: 'National Convention Center',
      date: '15/07/2026'
    },
    {
      id: 3,
      image: slide3,
      category: 'Sports',
      title: 'City Marathon Event',
      location: 'Le Van Tam Park',
      date: '05/08/2026'
    }
  ];

  // Auto-rotation every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const currentEvent = slides[currentSlide];

  return (
    <div className="hero-container">
      {/* Top Header Section */}
      <div className="hero-header">
        <h1>Welcome to <br/><span className="text-green">Event Organizer</span></h1>
        <p>
          Welcome to the event organizer website. Here you can manage, monitor, and update all of your events easily and effectively.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="hero-carousel">
        <div className="carousel-background" style={{ backgroundImage: `url(${currentEvent.image})` }}>
          <div className="carousel-overlay"></div>
        </div>
        
        {/* Carousel Controls */}
        <button className="carousel-btn prev" onClick={prevSlide}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="carousel-btn next" onClick={nextSlide}>
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Event Info */}
        <div className="carousel-content">
          <span className="badge category-badge">{currentEvent.category}</span>
          <h2 className="event-title">{currentEvent.title}</h2>
          <div className="event-meta">
            <span className="meta-item">
              <i className="bi bi-geo-alt me-2"></i>
              {currentEvent.location}
            </span>
            <span className="meta-item">
              <i className="bi bi-calendar3 me-2"></i>
              {currentEvent.date}
            </span>
          </div>
        </div>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, idx) => (
            <span 
              key={idx} 
              className={`indicator ${idx === currentSlide ? 'active' : ''}`} 
              onClick={() => setCurrentSlide(idx)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
