// src/pages/Dashboard/DeleteConfirmModal.jsx
import React from 'react';

const DeleteConfirmModal = ({ category, onConfirm, onCancel }) => {
  if (!category) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon-wrapper">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h3>Xác nhận xóa</h3>
        <p>
          Bạn có chắc chắn muốn xóa danh mục <strong>"{category.name}"</strong>?
          Hành động này không thể hoàn tác.
        </p>
        <div className="delete-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            <i className="bi bi-trash"></i> Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;