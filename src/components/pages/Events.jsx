import { useState, useEffect } from 'react';
import { getCategories } from '../../services/api';
import '../css/Events.css';

/**
 * Events Component - Form for creating an event
 */
const Events = ({ addToast }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    location: '',
    date_time: '',
    capacity: '',
    event_type: 'Free',
    require_additional_info: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // Depending on API response structure, adjust accordingly
        // Assuming response.data is an array or response.data.data is an array
        const catData = response.data.data || response.data;
        if (Array.isArray(catData)) {
          setCategories(catData);
        } else if (catData.categories) {
          setCategories(catData.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (addToast) addToast('Không thể tải danh mục sự kiện.', 'error');
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, [addToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implementation for API call will be here
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      location: '',
      date_time: '',
      capacity: '',
      event_type: 'Free',
      require_additional_info: false
    });
  };

  return (
    <div className="events-wrapper">
      <div className="events-header">
        <div className="container">
          <h1>Tạo Sự Kiện Mới</h1>
          <p>Điền thông tin chi tiết để thiết lập sự kiện của bạn</p>
        </div>
      </div>

      <div className="events-container">
        <div className="create-event-card">
          <h2>Thông tin sự kiện</h2>
          
          <form className="event-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Tên sự kiện <span className="text-danger">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên sự kiện"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả sự kiện</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về sự kiện của bạn"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category_id">Danh mục <span className="text-danger">*</span></label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  disabled={loadingCats}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Địa điểm <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Địa chỉ tổ chức sự kiện"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_time">Ngày & Giờ <span className="text-danger">*</span></label>
                <input
                  type="datetime-local"
                  id="date_time"
                  name="date_time"
                  value={formData.date_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Số lượng người (Capacity) <span className="text-danger">*</span></label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ví dụ: 100"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="event_type">Loại sự kiện <span className="text-danger">*</span></label>
                <select
                  id="event_type"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Free">Miễn phí (Free)</option>
                  <option value="Paid">Trả phí (Paid)</option>
                </select>
              </div>
            </div>

            {/* Checkbox "Require Additional Info" placeholder for CEP-44 */}

            <div className="form-actions">
              <button type="button" className="btn-reset-event" onClick={handleReset} disabled={isSubmitting}>
                Làm mới
              </button>
              <button type="submit" className="btn-submit-event" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner"></span> Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save"></i> Tạo sự kiện nháp
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Events;
