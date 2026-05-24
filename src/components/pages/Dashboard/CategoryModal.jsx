// src/pages/Dashboard/CategoryModal.jsx

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
        <p className="category-modal-desc">
          Provide details to add a new event category.
        </p>
        <form onSubmit={onSubmit}>
          <div className="category-form-group">
            <label>Category Name</label>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder="e.g., Technology, Arts, Workshop..."
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ name: e.target.value })}
                autoFocus
              />
              <i className="bi bi-tag-fill"></i>
            </div>
          </div>
          <div className="category-modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save" 
              disabled={formLoading || !categoryForm.name.trim()}
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