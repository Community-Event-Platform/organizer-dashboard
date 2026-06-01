const DeleteConfirmModal = ({ deleteConfirm, onCancel, onConfirm }) => {
  if (!deleteConfirm) return null;

  return (
    <div className="event-modal-overlay" onClick={onCancel}>
      <div className="event-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon-box">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h3>Confirm Event Deletion</h3>
        <p>Are you sure you want to delete the event "{deleteConfirm.name}"? This action cannot be undone.</p>
        <div className="delete-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
