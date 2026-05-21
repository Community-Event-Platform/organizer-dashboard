import { useState, useEffect } from 'react';
import { getCategories, getOrganizerEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';
import '../css/Events.css';

/**
 * Events Component - Displays a table of all events and a modal for creation/edition
 */
const Events = ({ addToast }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  // Modal & Edit state
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Form Builder state
  const [customFields, setCustomFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    location: '',
    date_time: '',
    capacity: '',
    event_type: 'Free',
    require_additional_info: false,
    status: 'Draft'
  });

  // Fetch organizer events
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await getOrganizerEvents();
      const eventsData = response.data.data || response.data;
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      if (addToast) addToast('Không thể tải danh sách sự kiện.', 'error');
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
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

    fetchEvents();
    fetchCategories();
  }, [addToast]);

  // Handle pagination and filtering reset
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEventTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      event_type: type,
      // Reset additional info if paid
      require_additional_info: type === 'Free' ? prev.require_additional_info : false
    }));
  };

  const handleAddCustomField = () => {
    if (!newFieldName.trim()) return;
    setCustomFields([...customFields, { name: newFieldName.trim(), type: newFieldType }]);
    setNewFieldName('');
  };

  const handleRemoveCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setCustomFields([]);
    setFormData({
      name: '',
      description: '',
      category_id: '',
      location: '',
      date_time: '',
      capacity: '',
      event_type: 'Free',
      require_additional_info: false,
      status: 'Draft'
    });
    setShowModal(true);
  };

  const formatDateTimeForInput = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const d = new Date(dateTimeStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateTimeForTable = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const d = new Date(dateTimeStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dateTimeStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    
    // Parse custom form spec if it exists
    let parsedFields = [];
    if (event.custom_form_spec) {
      try {
        const parsed = JSON.parse(event.custom_form_spec);
        if (Array.isArray(parsed)) {
          parsedFields = parsed;
        }
      } catch (e) {
        console.error('Error parsing custom_form_spec:', e);
      }
    }
    setCustomFields(parsedFields);

    setFormData({
      name: event.name || '',
      description: event.description || '',
      category_id: event.category_id || '',
      location: event.location || '',
      date_time: formatDateTimeForInput(event.date_time),
      capacity: event.capacity || '',
      event_type: event.event_type || 'Free',
      require_additional_info: event.require_additional_info === 1 || event.require_additional_info === true,
      status: event.status || 'Draft'
    });
    setShowModal(true);
  };

  const handleDeleteClick = (event) => {
    setDeleteConfirm(event);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteEvent(deleteConfirm.id);
      if (addToast) addToast('Xóa sự kiện thành công!', 'success');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      if (addToast) addToast(error.response?.data?.message || 'Không thể xóa sự kiện.', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        custom_form_spec: customFields.length > 0 ? JSON.stringify(customFields) : null
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        if (addToast) addToast('Cập nhật sự kiện thành công!', 'success');
      } else {
        await createEvent(payload);
        if (addToast) addToast('Tạo sự kiện nháp thành công!', 'success');
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Lỗi khi lưu sự kiện:', error);
      const msg = error.response?.data?.message || error.message || 'Không thể lưu sự kiện.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === '' || String(event.category_id) === String(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  return (
    <div className="events-page-wrapper">
      <div className="events-page-container">
        {/* Header Title Section */}
        <div className="events-page-header">
          <div className="header-text-block">
            <h1>All Participants</h1>
            <p>Create, manage and organize your events.</p>
          </div>
        </div>

        {/* Toolbar Controls: Search, Filter, Add button */}
        <div className="events-toolbar">
          <div className="toolbar-left">
            <div className="search-input-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search Events...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-dropdown-wrapper">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={loadingCats}
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn-add-new-event" onClick={handleOpenAddModal}>
            <i className="bi bi-plus"></i> Add New Event
          </button>
        </div>

        {/* Events Table / Styled Cards */}
        <div className="table-responsive-wrapper">
          <table className="events-custom-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Descriptions</th>
                <th>Categories</th>
                <th>Ticket Type</th>
                <th>Event Date</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Reviews</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingEvents ? (
                <tr>
                  <td colSpan="10" className="table-state-cell">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu sự kiện...</p>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="10" className="table-state-cell">
                    <i className="bi bi-inbox-fill empty-icon"></i>
                    <p>Không tìm thấy sự kiện nào.</p>
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((event) => (
                  <tr key={event.id} className="event-table-row">
                    <td className="cell-event-name">{event.name}</td>
                    <td className="cell-description">
                      <div className="description-text" title={event.description}>
                        {event.description || 'Không có mô tả.'}
                      </div>
                    </td>
                    <td>
                      <span className="badge-category">
                        {event.category ? event.category.name : 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-ticket-type ${event.event_type === 'Free' ? 'type-free' : 'type-paid'}`}>
                        {event.event_type}
                      </span>
                    </td>
                    <td className="cell-date">{formatDateTimeForTable(event.date_time)}</td>
                    <td className="cell-location">{event.location}</td>
                    <td className="cell-capacity">
                      {event.registrations_count !== undefined ? event.registrations_count : 0}/{event.capacity}
                    </td>
                    <td>
                      <span className={`badge-status status-${(event.status || 'Draft').toLowerCase()}`}>
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-view-reviews">
                        View <strong>{event.reviews_count || 0}</strong>
                      </button>
                    </td>
                    <td className="cell-actions text-center">
                      <button className="btn-edit" onClick={() => handleOpenEditModal(event)} title="Chỉnh sửa">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteClick(event)} title="Xóa">
                        <i className="bi bi-lock-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="events-pagination-container">
            <button
              className="btn-pagination-nav"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`btn-pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="btn-pagination-nav"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* ===== Create/Edit Event Modal Popup ===== */}
      {showModal && (
        <div className="event-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="event-modal-header">
              <div className="header-title-wrapper">
                <div className="header-icon-box">
                  <i className="bi bi-plus-lg"></i>
                </div>
                <div className="header-text">
                  <h2>{editingEvent ? 'Chỉnh sửa sự kiện' : 'Create New Event'}</h2>
                  <p>Provide details to organize your community event.</p>
                </div>
              </div>
              <button className="modal-close-x" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="event-modal-form">
              {/* Event Name & Category */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label htmlFor="name">Event Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="T Giải bóng đá cộng đồng"
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="category_id">Categories <span className="req">*</span></label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    disabled={loadingCats}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="modal-form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết sự kiện của bạn..."
                  rows="3"
                ></textarea>
              </div>

              {/* Location */}
              <div className="modal-form-group full-width">
                <label htmlFor="location">Location <span className="req">*</span></label>
                <div className="input-with-icon">
                  <i className="bi bi-geo-alt icon-prefix"></i>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Sân vận động Chi Lăng"
                    required
                  />
                </div>
              </div>

              {/* Event Date & Time */}
              <div className="modal-form-group full-width">
                <label htmlFor="date_time">Event Date & Time <span className="req">*</span></label>
                <div className="input-with-icon">
                  <i className="bi bi-calendar3 icon-prefix"></i>
                  <input
                    type="datetime-local"
                    id="date_time"
                    name="date_time"
                    value={formData.date_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Ticket & Registration Type */}
              <div className="registration-type-section full-width">
                <label className="section-label">Ticket & Registration Type</label>
                
                {/* Free / Paid Segment Option */}
                <div className="event-type-selector">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="event_type"
                      checked={formData.event_type === 'Free'}
                      onChange={() => handleEventTypeChange('Free')}
                    />
                    <span className="custom-radio"></span>
                    Free Event
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="event_type"
                      checked={formData.event_type === 'Paid'}
                      onChange={() => handleEventTypeChange('Paid')}
                    />
                    <span className="custom-radio"></span>
                    Paid Event
                  </label>
                </div>

                {/* Additional requirements box (Only for Free Event) */}
                {formData.event_type === 'Free' && (
                  <div className="custom-form-requirements-box">
                    <label className="inner-radio-label">
                      <input
                        type="radio"
                        name="require_additional_info"
                        checked={!formData.require_additional_info}
                        onChange={() => setFormData(prev => ({ ...prev, require_additional_info: false }))}
                      />
                      <span className="custom-radio"></span>
                      No requirements (One-click register)
                    </label>
                    
                    <label className="inner-radio-label">
                      <input
                        type="radio"
                        name="require_additional_info"
                        checked={formData.require_additional_info}
                        onChange={() => setFormData(prev => ({ ...prev, require_additional_info: true }))}
                      />
                      <span className="custom-radio"></span>
                      Require Custom Form
                    </label>

                    {/* Custom Form Spec Builder UI */}
                    {formData.require_additional_info && (
                      <div className="custom-fields-builder">
                        <div className="builder-input-row">
                          <input
                            type="text"
                            placeholder="Field name (e.g. Lý do tham gia)"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                          />
                          <select
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value)}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                          <button
                            type="button"
                            className="btn-add-field"
                            onClick={handleAddCustomField}
                          >
                            + Add
                          </button>
                        </div>

                        {/* List of current custom fields */}
                        {customFields.length > 0 && (
                          <div className="added-fields-list">
                            {customFields.map((field, idx) => (
                              <div key={idx} className="added-field-item">
                                <span className="field-name-type">
                                  <strong>{field.name}</strong> ({field.type})
                                </span>
                                <button
                                  type="button"
                                  className="btn-remove-field"
                                  onClick={() => handleRemoveCustomField(idx)}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Capacity & Status */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label htmlFor="capacity">Capacity <span className="req">*</span></label>
                  <div className="input-with-icon">
                    <i className="bi bi-people icon-prefix"></i>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      min="1"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="150"
                      required
                    />
                  </div>
                </div>
                <div className="modal-form-group">
                  <label htmlFor="status">Status <span className="req">*</span></label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Submit button */}
              <div className="modal-form-actions">
                <button type="submit" className="btn-register-event-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner"></span> Đang lưu...
                    </>
                  ) : (
                    editingEvent ? 'Lưu thay đổi' : 'Register Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="event-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="event-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-box">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h3>Xác nhận xóa sự kiện</h3>
            <p>Bạn có chắc chắn muốn xóa sự kiện "{deleteConfirm.name}" không? Hành động này không thể hoàn tác.</p>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Hủy
              </button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
                Xóa sự kiện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
