// src/pages/Dashboard/CategoryModal.jsx
import React from 'react';

const CategoryModal = ({ 
  isOpen, 
  editingCategory, 
  categoryForm, 
  setCategoryForm, 
  onSubmit, 
  onClose, 
  formLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <div className="category-modal-header">
          <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <p style={{ color: '#666', fontSize: '14px', margin: '-10px 0 20px 0' }}>
          Provide details to add a new event category.
        </p>
        <form onSubmit={onSubmit}>
          <div className="category-form-group">
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Category Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g., Technology, Arts, Workshop..."
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ name: e.target.value })}
                autoFocus
                style={{ paddingLeft: '35px' }}
              />
              <i className="bi bi-tag-fill" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
            </div>
          </div>
          <div className="category-modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              style={{ backgroundColor: '#e0e0e0', color: '#333' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save" 
              disabled={formLoading || !categoryForm.name.trim()}
              style={{ minWidth: '140px' }}
            >
              {formLoading ? (
                <>
                  <span className="btn-spinner"></span> Saving...
                </>
              ) : (
                editingCategory ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;