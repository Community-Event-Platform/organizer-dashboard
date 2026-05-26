import { useEffect } from 'react';

/**
 * FormResponseModal - CEP-84
 * Displays a participant's submitted form answers.
 * Allows the organizer to Approve or Reject the registration.
 */
const FormResponseModal = ({ participant, onClose, onApprove, onReject }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!participant) return null;

  const { attendee, event, form_responses, status } = participant;


  return (
    <div className="form-response-overlay" onClick={onClose}>
      <div className="form-response-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="form-response-modal-header">
          <h3>Form Response Detail</h3>
          <p>Review participant's custom submitted information</p>
          <button className="modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="form-response-modal-body">

          {/* Basic Info */}
          <p className="form-section-title">BASIC INFO</p>
          <div className="form-basic-info">
            <div className="info-row">
              <span className="info-label">Full Name:</span>
              <span className="info-value">{attendee?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email Address:</span>
              <span className="info-value">{attendee?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Registered Event:</span>
              <span className="info-value event-link">{event?.name}</span>
            </div>
          </div>

          {/* Submitted Questions */}
          {form_responses && form_responses.length > 0 ? (
            <>
              <p className="form-section-title">SUBMITTED QUESTIONS</p>
              <div className="form-questions">
                {form_responses.map((fr, idx) => (
                  <div className="form-question-item" key={idx}>
                    <span className="q-label">{idx + 1}. {fr.field_name}</span>
                    <div className="q-answer">{fr.response_value || '(No answer)'}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
              No form responses submitted.
            </p>
          )}
        </div>

        {/* Footer actions — only show if still Pending */}
        {status === 'Pending' && (
          <div className="form-response-modal-footer">
            <button className="modal-btn-reject" onClick={() => onReject(participant.id)}>
              Reject
            </button>
            <button className="modal-btn-approve" onClick={() => onApprove(participant.id)}>
              Approve Participant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponseModal;
