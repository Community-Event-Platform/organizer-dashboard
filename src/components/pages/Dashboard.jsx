import { useState, useEffect } from 'react';
import { getDashboardStats, getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import '../css/Dashboard.css';

/**
 * Dashboard - Organizer main dashboard
 * Features: Hero section, statistics cards, categories CRUD table
 * All data fetched from API with loading/error states
 */
const Dashboard = ({ addToast }) => {
  // Dashboard statistics
  const [stats, setStats] = useState({
    totalEvents: 0,
    participants: 0,
    activeEvents: 0,
  });

  // Categories management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Category form modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ===== Fetch dashboard stats and categories from API =====
  useEffect(() => {
    const fetchDashboardData = async () => {
      setStatsLoading(true);
      setLoading(true);
      try {
        const response = await getDashboardStats();
        const data = response.data;
        
        // 1. Set stats
        const statsData = data.stats || {};
        setStats({
          totalEvents: statsData.total_events || statsData.totalEvents || 0,
          participants: statsData.total_participants || statsData.participants || 0,
          activeEvents: statsData.active_events || statsData.activeEvents || 0,
        });

        // 2. Set categories with event counts
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        if (addToast) addToast('Unable to load dashboard data. Please try again.', 'error');
      } finally {
        setStatsLoading(false);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [addToast]);

  // ===== Category CRUD handlers =====

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
    setShowCategoryModal(true);
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm(category);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteCategory(deleteConfirm.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
      if (addToast) addToast('Category deleted successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to delete category.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      if (addToast) addToast('Please enter a category name.', 'warning');
    }

    setFormLoading(true);
    try {
      if (editingCategory) {
        // Update existing category
        const response = await updateCategory(editingCategory.id, { name: categoryForm.name });
        const updated = response.data.data || response.data;
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated, name: categoryForm.name } : c))
        );
        if (addToast) addToast('Category updated successfully!', 'success');
      } else {
        // Create new category
        const response = await createCategory({ name: categoryForm.name });
        const newCat = response.data.data || response.data;
        setCategories((prev) => [...prev, newCat]);
        if (addToast) addToast('Category added successfully!', 'success');
      }
      setShowCategoryModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred. Please try again.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Category icon mapping
  const getCategoryIcon = (name) => {
    const icons = {
      'Music': { icon: 'bi-music-note-beamed', class: 'cat-icon-purple' },
      'Sports': { icon: 'bi-dribbble', class: 'cat-icon-orange' },
      'Community': { icon: 'bi-people-fill', class: 'cat-icon-blue' },
      'Technology': { icon: 'bi-cpu', class: 'cat-icon-green' },
      'Education': { icon: 'bi-book', class: 'cat-icon-blue' },
      'Food': { icon: 'bi-cup-hot', class: 'cat-icon-orange' },
      'Art': { icon: 'bi-palette', class: 'cat-icon-purple' },
    };
    return icons[name] || { icon: 'bi-tag', class: 'cat-icon-default' };
  };

  // Statistics cards data
  const statCards = [
    {
      id: 1,
      label: 'Total Events',
      value: statsLoading ? '...' : stats.totalEvents,
      icon: 'bi-calendar-event',
      colorClass: 'stat-blue',
    },
    {
      id: 2,
      label: 'Total Registrations',
      value: statsLoading ? '...' : stats.participants,
      icon: 'bi-people',
      colorClass: 'stat-orange',
    },
    {
      id: 3,
      label: 'Active Events',
      value: statsLoading ? '...' : stats.activeEvents,
      icon: 'bi-graph-up-arrow',
      colorClass: 'stat-green',
    },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* ===== Dashboard Hero Section - Green gradient ===== */}
      <div className="dashboard-hero">
        <div className="container">
          <h1>
            <em>Welcome back</em>
            <br />
            Event organizer
          </h1>
          <p>Manage and track your events</p>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="container">
          {/* ===== Statistics Section ===== */}
          <section className="dashboard-section">
            <h2 className="section-title">Dashboard Overview</h2>
            <div className="stats-grid">
              {statCards.map((stat) => (
                <div key={stat.id} className={`stat-card ${stat.colorClass}`}>
                  <div className="stat-icon-wrapper">
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== Categories Section ===== */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Event Categories</h2>
              <button className="btn-add-category" onClick={handleAddCategory}>
                <i className="bi bi-plus-lg"></i> Add Category
              </button>
            </div>

            <div className="categories-card">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Event Count</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="table-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading data...</span>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="table-empty">
                        <i className="bi bi-inbox"></i>
                        <span>No categories yet. Add your first category!</span>
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => {
                      const iconData = getCategoryIcon(cat.name);
                      return (
                        <tr key={cat.id}>
                          <td className="td-id">{cat.id}</td>
                          <td>
                            <div className="category-name-cell">
                              <div className={`category-icon ${iconData.class}`}>
                                <i className={`bi ${iconData.icon}`}></i>
                              </div>
                              <span>{cat.name}</span>
                            </div>
                          </td>
                          <td className="td-count">{cat.eventsCount || cat.events_count || 0}</td>
                          <td className="td-actions">
                            {(() => {
                              const hasEvents = (cat.eventsCount || cat.events_count || 0) > 0;
                              return (
                                <>
                                  <button
                                    className="btn-action btn-action-edit"
                                    onClick={() => !hasEvents && handleEditCategory(cat)}
                                    disabled={hasEvents}
                                    title={hasEvents ? 'This category has events and cannot be edited.' : 'Edit'}
                                  >
                                    <i className="bi bi-pencil-square"></i> Edit
                                  </button>
                                  <button
                                    className="btn-action btn-action-delete"
                                    onClick={() => !hasEvents && handleDeleteClick(cat)}
                                    disabled={hasEvents}
                                    title={hasEvents ? 'This category has events and cannot be deleted.' : 'Delete'}
                                  >
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                                </>
                              );
                            })()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* ===== Category Add/Edit Modal ===== */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
              <button className="modal-close-btn" onClick={() => setShowCategoryModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCategorySubmit}>
              <div className="category-form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ name: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="category-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <span className="btn-spinner"></span> Saving...
                    </>
                  ) : (
                    editingCategory ? 'Save Changes' : 'Add Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Delete Confirmation Modal ===== */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-wrapper">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the category "{deleteConfirm.name}"?
            </p>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
