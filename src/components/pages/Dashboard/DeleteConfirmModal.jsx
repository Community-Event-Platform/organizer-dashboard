// src/pages/Dashboard/DeleteConfirmModal.jsx

const DeleteConfirmModal = ({ category, onConfirm, onCancel }) => {
  if (!category) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon-wrapper">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete the category <strong>"{category.name}"</strong>?
          This action cannot be undone.
        </p>
        <div className="delete-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            <i className="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;