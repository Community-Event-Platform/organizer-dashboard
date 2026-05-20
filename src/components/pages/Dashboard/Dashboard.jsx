import { useState, useEffect } from 'react';
import { getDashboardStats, createCategory, updateCategory, deleteCategory } from '../../../services/api';
import '../../css/Dashboard.css';
import CategoryTable from './CategoryTable';
import CategoryModal from './CategoryModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const Dashboard = ({ addToast }) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    participants: 0,
    activeEvents: 0,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [formLoading, setFormLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Hàm Fetch dữ liệu chính đồng bộ toàn trang
  const fetchDashboardData = async () => {
    setStatsLoading(true);
    setLoading(true);
    try {
      const response = await getDashboardStats();
      const data = response.data;
      
      const statsData = data.stats || {};
      setStats({
        totalEvents: statsData.total_events || statsData.totalEvents || 0,
        participants: statsData.total_participants || statsData.participants || 0,
        activeEvents: statsData.active_events || statsData.activeEvents || 0,
      });

      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      if (addToast) addToast('Không thể tải dữ liệu dashboard.', 'error');
    } finally {
      setStatsLoading(false);
      setLoading(false);
    }
  };

  // Mảng phụ thuộc [] rỗng dứt điểm việc lặp request vô hạn
  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      if (addToast) addToast('Xóa danh mục thành công!', 'success');
      fetchDashboardData(); // Cập nhật lại danh sách ngay lập tức
    } catch (err) {
      console.error('Error deleting category:', err);
      const msg = err.response?.data?.message || 'Không thể xóa danh mục.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const trimmedName = categoryForm.name.trim();

    if (!trimmedName) {
      if (addToast) addToast('Vui lòng nhập tên danh mục.', 'warning');
      return;
    }

    setFormLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: trimmedName });
        if (addToast) addToast('Cập nhật danh mục thành công!', 'success');
      } else {
        await createCategory({ name: trimmedName });
        if (addToast) addToast('Thêm danh mục thành công!', 'success');
      }
      setShowCategoryModal(false);
      setCategoryForm({ name: '' });
      fetchDashboardData(); // Tự động đồng bộ số liệu mới mà không cần F5
    } catch (err) {
      console.error('Error saving category:', err);
      const msg = err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

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

  const statCards = [
    { id: 1, label: 'Total Events', value: statsLoading ? '...' : stats.totalEvents, icon: 'bi-calendar-event', colorClass: 'stat-blue' },
    { id: 2, label: 'Participants', value: statsLoading ? '...' : stats.participants, icon: 'bi-people', colorClass: 'stat-orange' },
    { id: 3, label: 'Active Events', value: statsLoading ? '...' : stats.activeEvents, icon: 'bi-graph-up-arrow', colorClass: 'stat-green' },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-hero">
        <div className="container">
          <h1><em>Chào mừng bạn đến với</em><br />Event organizer</h1>
          <p>Quản lý và theo dõi các sự kiện của bạn</p>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="container">
          <section className="dashboard-section">
            <h2 className="section-title">Dashboard Overview</h2>
            <div className="stats-grid">
              {statCards.map((stat) => (
                <div key={stat.id} className={`stat-card ${stat.colorClass}`}>
                  <div className="stat-icon-wrapper"><i className={`bi ${stat.icon}`}></i></div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Events Categories</h2>
              <button className="btn-add-category" onClick={handleAddCategory}>
                <i className="bi bi-plus-lg"></i> Add New Categories
              </button>
            </div>

            <div className="categories-card">
              <CategoryTable 
                categories={categories}
                loading={loading}
                onEdit={handleEditCategory}
                onDelete={handleDeleteClick}
                getCategoryIcon={getCategoryIcon}
              />
            </div>
          </section>
        </div>
      </div>

      <CategoryModal 
        isOpen={showCategoryModal}
        editingCategory={editingCategory}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        onSubmit={handleCategorySubmit}
        onClose={() => setShowCategoryModal(false)}
        formLoading={formLoading}
      />

      <DeleteConfirmModal 
        category={deleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default Dashboard;