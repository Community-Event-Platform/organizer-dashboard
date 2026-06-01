const ViewEventModal = ({ viewEvent, onClose, resolveImageUrl, formatDateTimeForTable, onNavigateToParticipants, onEndEvent }) => {
  if (!viewEvent) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content view-modal-premium" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header premium-header">
          <div className="header-title-wrapper">
            <div className="header-text">
              <h2 style={{ fontSize: '1.75rem', color: '#1e293b', margin: 0 }}>{viewEvent.name}</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Event Details & Information</p>
            </div>
          </div>
          <div className="header-action-group">
            {viewEvent.status?.toLowerCase() === 'published' && onEndEvent && (
              <button
                className="btn-end-event"
                onClick={() => onEndEvent(viewEvent.id)}
                style={{ marginRight: '0.75rem' }}
              >
                <i className="bi bi-flag"></i> End Event
              </button>
            )}
            <button className="modal-close-x" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        
        <div className="event-view-content premium-content">
          <div className="event-view-top-section">
            {viewEvent.image && (
              <div className="event-view-left">
                <div className="event-detail-image-premium">
                  <img src={resolveImageUrl(viewEvent.image)} alt={viewEvent.name} />
                  <div className="image-badge">
                    <span className={`badge-status status-${viewEvent.status?.toLowerCase()}`}>
                      {viewEvent.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className={`event-view-right ${!viewEvent.image ? 'full-width' : ''}`}>
              <div className="event-detail-grid-premium">
                <div className="detail-item-premium">
                  <div className="detail-text-content">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{viewEvent.category?.name || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="detail-item-premium">
                  <div className="detail-text-content">
                    <span className="detail-label">Date & Time</span>
                    <span className="detail-value">{formatDateTimeForTable(viewEvent.date_time)}</span>
                  </div>
                </div>
                
                <div className="detail-item-premium">
                  <div className="detail-text-content">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{viewEvent.location}</span>
                  </div>
                </div>
                
                <div className="detail-item-premium">
                  <div className="detail-text-content">
                    <span className="detail-label">Capacity (Registered / Total)</span>
                    <span className="detail-value">
                      <span 
                        className="capacity-link" 
                        onClick={() => {
                          if (onNavigateToParticipants) {
                            onNavigateToParticipants(viewEvent.id);
                          }
                        }}
                      >
                        {(viewEvent.participants_count ?? viewEvent.registrations_count ?? 0)} / {viewEvent.capacity}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="detail-item-premium">
                  <div className="detail-text-content">
                    <span className="detail-label">Event Type</span>
                    <span className="detail-value">
                      <span className={`badge-ticket-type type-${viewEvent.event_type?.toLowerCase()}`}>
                        {viewEvent.event_type}
                      </span>
                    </span>
                  </div>
                </div>
                
                {!viewEvent.image && (
                  <div className="detail-item-premium">
                    <div className="detail-text-content">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">
                        <span className={`badge-status status-${viewEvent.status?.toLowerCase()}`}>
                          {viewEvent.status}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="event-detail-description-premium">
            <h3>About This Event</h3>
            <div className="desc-content-box">
              <p>{viewEvent.description || 'No description provided for this event.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
