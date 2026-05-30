const ReviewModal = ({ viewReviewsEvent, reviewsPage, setReviewsPage, onClose }) => {
  if (!viewReviewsEvent) return null;

  const totalPages = Math.ceil((viewReviewsEvent.reviews?.length || 0) / 4);

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content reviews-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header">
          <div className="header-title-wrapper">
            <div className="header-icon-box">
              <i className="bi bi-star-fill"></i>
            </div>
            <div className="header-text">
              <h2>Reviews for {viewReviewsEvent.name}</h2>
              <p>Read what participants said about this event.</p>
            </div>
          </div>
          <button className="modal-close-x" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="reviews-list-container">
          {(!viewReviewsEvent.reviews || viewReviewsEvent.reviews.length === 0) ? (
            <div className="table-state-cell">
              <i className="bi bi-chat-square-text empty-icon"></i>
              <p>No reviews yet.</p>
            </div>
          ) : (
            <>
              <div className="reviews-grid">
                {viewReviewsEvent.reviews
                  .slice((reviewsPage - 1) * 4, reviewsPage * 4)
                  .map((review, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-header">
                        <span className="reviewer-name">{review.user_name || review.reviewer_name || review.attendee?.name || 'Anonymous'}</span>
                        <span className="review-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`bi bi-star${i < review.rating ? '-fill text-warning' : ''}`}></i>
                          ))}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
              </div>

              {totalPages > 1 && (
                <div className="events-pagination-container">
                  <button
                    className="btn-pagination-nav"
                    onClick={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                    disabled={reviewsPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`btn-pagination-number ${reviewsPage === page ? 'active' : ''}`}
                      onClick={() => setReviewsPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="btn-pagination-nav"
                    onClick={() => setReviewsPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={reviewsPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
