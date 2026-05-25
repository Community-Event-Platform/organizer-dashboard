const ViewEventModal = ({ viewEvent, onClose, resolveImageUrl, formatDateTimeForTable }) => {
  if (!viewEvent) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header">
          <div className="header-title-wrapper">
            <div className="header-icon-box">
              <i className="bi bi-eye"></i>
            </div>
            <div className="header-text">
              <h2>Event Details</h2>
              <p>Review the published event information.</p>
            </div>
          </div>
          <button className="modal-close-x" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="event-view-content">
          {viewEvent.image && (
            <div className="event-detail-image">
              <img src={resolveImageUrl(viewEvent.image)} alt={viewEvent.name} />
            </div>
          )}
          <div className="event-detail-grid">
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span>{viewEvent.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span>{viewEvent.category?.name || 'Unknown'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date & Time</span>
              <span>{formatDateTimeForTable(viewEvent.date_time)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span>{viewEvent.location}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type</span>
              <span>{viewEvent.event_type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Capacity</span>
              <span>{viewEvent.capacity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span>{viewEvent.status}</span>
            </div>
          </div>
          <div className="event-detail-description">
            <h3>Description</h3>
            <p>{viewEvent.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
