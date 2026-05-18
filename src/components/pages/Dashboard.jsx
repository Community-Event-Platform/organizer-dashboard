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
        if (addToast) addToast('Không thể tải dữ liệu dashboard. Vui lòng thử lại.', 'error');
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
      if (addToast) addToast('Xóa danh mục thành công!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể xóa danh mục.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      if (addToast) addToast('Vui lòng nhập tên danh mục.', 'warning');
      return;
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
        if (addToast) addToast('Cập nhật danh mục thành công!', 'success');
      } else {
        // Create new category
        const response = await createCategory({ name: categoryForm.name });
        const newCat = response.data.data || response.data;
        setCategories((prev) => [...prev, newCat]);
        if (addToast) addToast('Thêm danh mục thành công!', 'success');
      }
      setShowCategoryModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
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
      label: 'Participants',
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
            <em>Chào mừng bạn đến với</em>
            <br />
            Event organizer
          </h1>
          <p>Quản lý và theo dõi các sự kiện của bạn</p>
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
              <h2 className="section-title">Events Categories</h2>
              <button className="btn-add-category" onClick={handleAddCategory}>
                <i className="bi bi-plus-lg"></i> Add Category
              </button>
            </div>

            <div className="categories-card">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Categories Name</th>
                    <th>Number of events</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="table-loading">
                        <div className="loading-spinner"></div>
                        <span>Đang tải dữ liệu...</span>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="table-empty">
                        <i className="bi bi-inbox"></i>
                        <span>Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</span>
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
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleEditCategory(cat)}
                            >
                              <i className="bi bi-pencil-square"></i> Edit
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleDeleteClick(cat)}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
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
              <h3>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <button className="modal-close-btn" onClick={() => setShowCategoryModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCategorySubmit}>
              <div className="category-form-group">
                <label>Tên danh mục</label>
                <input
                  type="text"
                  placeholder="Nhập tên danh mục..."
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
                  Hủy
                </button>
                <button type="submit" className="btn-save" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <span className="btn-spinner"></span> Đang lưu...
                    </>
                  ) : (
                    editingCategory ? 'Cập nhật' : 'Thêm mới'
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
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa danh mục <strong>"{deleteConfirm.name}"</strong>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Hủy
              </button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
                <i className="bi bi-trash"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
