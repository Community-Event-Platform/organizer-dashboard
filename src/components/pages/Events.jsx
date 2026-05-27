import { useState, useEffect, useCallback } from 'react';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const eventsPerPage = 4;
  
  const [viewReviewsEvent, setViewReviewsEvent] = useState(null);
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsPerPage = 4;

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customFields, setCustomFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewEvent, setViewEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    location: '',
    date_time: '',
    capacity: '',
    event_type: 'Free',
    require_additional_info: false,
    status: 'draft',
    image: null,
    price: 0,
    fees_and_taxes: 0,
  });

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const response = await getOrganizerEvents();
      const eventsData = response.data.data || response.data;
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      if (addToast) addToast('Unable to load event list.', 'error');
    } finally {
      setLoadingEvents(false);
    }
  }, [addToast]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const catData = response.data.data || response.data;
        const categoriesList = Array.isArray(catData)
          ? catData
          : catData.categories || [];
        setCategories([...categoriesList].sort((a, b) => Number(b.id) - Number(a.id)));
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (addToast) addToast('Unable to load event categories.', 'error');
      } finally {
        setLoadingCats(false);
      }
    };

    const loadInitialData = async () => {
      await fetchEvents();
      await fetchCategories();
    };

    loadInitialData();
  }, [addToast, fetchEvents]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const fieldValue = type === 'checkbox'
      ? checked
      : type === 'file'
      ? files && files[0]
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue || null,
    }));
  };

  const handleEventTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      event_type: type,
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
      status: 'draft',
      image: null,
      price: 0,
      fees_and_taxes: 0,
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

  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const rawApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    if (!rawApiUrl) return imagePath;

    const apiBase = rawApiUrl.replace(/\/api$/, '');

    if (imagePath.startsWith('/')) {
      return `${apiBase}${imagePath}`;
    }
    return `${apiBase}/${imagePath}`;
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    
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
      status: event.status || 'draft',
      image: null,
    });
    setShowModal(true);
  };

  const handleDeleteClick = (event) => {
    setDeleteConfirm(event);
  };

  const handleOpenViewModal = (event) => {
    setViewEvent(event);
  };

  const handleCloseViewModal = () => {
    setViewEvent(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteEvent(deleteConfirm.id);
      if (addToast) addToast('Event deleted successfully!', 'success');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      if (addToast) addToast(error.response?.data?.message || 'Unable to delete event.', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const eventDate = new Date(formData.date_time);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate.getTime() - currentDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    
    if (diffDays < 3) {
      if (addToast) addToast('Event start date must be at least 3 days from today.', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description || '');
      formPayload.append('category_id', formData.category_id);
      formPayload.append('location', formData.location);
      formPayload.append('date_time', formData.date_time);
      formPayload.append('capacity', formData.capacity);
      formPayload.append('status', formData.status);
      formPayload.append('event_type', formData.event_type);
      formPayload.append('require_additional_info', formData.require_additional_info ? 1 : 0);

      if (customFields.length > 0) {
        formPayload.append('custom_form_spec', JSON.stringify(customFields));
      }

      if (formData.image) {
        formPayload.append('image', formData.image);
      }

      if (editingEvent) {
        await updateEvent(editingEvent.id, formPayload);
        if (addToast) addToast('Event updated successfully!', 'success');
      } else {
        await createEvent(formPayload);
        if (addToast) addToast('Draft event created successfully!', 'success');
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      const msg = error.response?.data?.message || error.message || 'Unable to save event.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === '' || String(event.category_id) === String(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingFilteredEvents = filteredEvents.filter(event => new Date(event.date_time) >= now);
  const pastFilteredEvents = filteredEvents.filter(event => new Date(event.date_time) < now);

  const upcomingTotalPages = Math.ceil(upcomingFilteredEvents.length / eventsPerPage) || 1;
  const paginatedUpcomingEvents = upcomingFilteredEvents.slice(
    (upcomingPage - 1) * eventsPerPage,
    upcomingPage * eventsPerPage
  );

  const pastTotalPages = Math.ceil(pastFilteredEvents.length / eventsPerPage) || 1;
  const paginatedPastEvents = pastFilteredEvents.slice(
    (pastPage - 1) * eventsPerPage,
    pastPage * eventsPerPage
  );

  const renderPagination = (currentPage, totalPages, setPage) => {
    if (totalPages <= 1) return null;
    return (
      <div className="events-pagination-container">
        <button
          className="btn-pagination-nav"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`btn-pagination-number ${currentPage === page ? 'active' : ''}`}
            onClick={() => setPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="btn-pagination-nav"
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="events-page-wrapper">
      <div className="events-page-container">
        {/* Header Title Section */}
        <div className="events-page-header">
          <div className="header-text-block">
            <h1>All Events</h1>
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setUpcomingPage(1);
                  setPastPage(1);
                }}
              />
            </div>
            <div className="filter-dropdown-wrapper">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setUpcomingPage(1);
                  setPastPage(1);
                }}
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

        {/* Upcoming / Created Events Table */}
        <h3 className="table-section-title">Upcoming / Created Events</h3>
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
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingEvents ? (
                <tr>
                  <td colSpan="9" className="table-state-cell">
                    <div className="loading-spinner"></div>
                    <p>Loading event data...</p>
                  </td>
                </tr>
              ) : upcomingFilteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="table-state-cell">
                    <i className="bi bi-inbox-fill empty-icon"></i>
                    <p>No upcoming events found.</p>
                  </td>
                </tr>
              ) : (
                paginatedUpcomingEvents.map((event) => (
                  <tr key={event.id} className="event-table-row">
                    <td className="cell-event-name">{event.name}</td>
                    <td className="cell-description">
                      <div className="description-text" title={event.description}>
                        {event.description || 'No description available.'}
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
                      <span className={`badge-status status-${(event.status || 'draft').toLowerCase()}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="cell-actions text-center">
                      {event.status?.toLowerCase() === 'published' ? (
                        <button className="btn-view" onClick={() => handleOpenViewModal(event)} title="View details">
                          <i className="bi bi-eye"></i>
                        </button>
                      ) : (
                        <>
                          <button className="btn-edit" onClick={() => handleOpenEditModal(event)} title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteClick(event)} title="Delete">
                            <i className="bi bi-lock-fill"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {renderPagination(upcomingPage, upcomingTotalPages, setUpcomingPage)}

        {/* Past Events Table */}
        <h3 className="table-section-title mt-4">Past Events</h3>
        <div className="table-responsive-wrapper">
          <table className="events-custom-table past-events-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Reviews</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingEvents ? (
                <tr>
                  <td colSpan="3" className="table-state-cell">
                    <div className="loading-spinner"></div>
                    <p>Loading event data...</p>
                  </td>
                </tr>
              ) : pastFilteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="3" className="table-state-cell">
                    <i className="bi bi-inbox-fill empty-icon"></i>
                    <p>No past events found.</p>
                  </td>
                </tr>
              ) : (
                paginatedPastEvents.map((event) => (
                  <tr key={event.id} className="event-table-row">
                    <td className="cell-event-name">{event.name}</td>
                    <td>
                      <span className="reviews-count-badge">
                        {event.reviews_count || 0} reviews
                      </span>
                    </td>
                    <td className="cell-actions text-center">
                      <button className="btn-view-details" onClick={() => { setViewReviewsEvent(event); setReviewsPage(1); }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {renderPagination(pastPage, pastTotalPages, setPastPage)}

      </div>

      {/* ===== Reviews Modal Popup ===== */}
      {viewReviewsEvent && (
        <div className="event-modal-overlay" onClick={() => setViewReviewsEvent(null)}>
          <div className="event-modal-content reviews-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <div className="header-title-wrapper">
                <div className="header-icon-box">
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="header-text">
                  <h2>Reviews for {viewReviewsEvent.name}</h2>
                  <p>Read what participants said about this event.</p>
                </div>
              </div>
              <button className="modal-close-x" onClick={() => setViewReviewsEvent(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="reviews-list-container">
              {(!viewReviewsEvent.reviews || viewReviewsEvent.reviews.length === 0) ? (
                <div className="table-state-cell">
                  <i className="bi bi-chat-square-text empty-icon"></i>
                  <p>No reviews yet.</p>
                </div>
              ) : (
                <>
                  <div className="reviews-grid">
                    {viewReviewsEvent.reviews
                      .slice((reviewsPage - 1) * reviewsPerPage, reviewsPage * reviewsPerPage)
                      .map((review, idx) => (
                        <div key={idx} className="review-card">
                          <div className="review-header">
                            <span className="reviewer-name">{review.user_name || 'Anonymous'}</span>
                            <span className="review-rating">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i key={i} className={`bi bi-star${i < review.rating ? '-fill text-warning' : ''}`}></i>
                              ))}
                            </span>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))
                    }
                  </div>
                  {Math.ceil((viewReviewsEvent.reviews?.length || 0) / reviewsPerPage) > 1 && (
                    <div className="events-pagination-container">
                      <button
                        className="btn-pagination-nav"
                        onClick={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                        disabled={reviewsPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      {Array.from({ length: Math.ceil(viewReviewsEvent.reviews.length / reviewsPerPage) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`btn-pagination-number ${reviewsPage === page ? 'active' : ''}`}
                          onClick={() => setReviewsPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className="btn-pagination-nav"
                        onClick={() => setReviewsPage(prev => Math.min(prev + 1, Math.ceil(viewReviewsEvent.reviews.length / reviewsPerPage)))}
                        disabled={reviewsPage === Math.ceil(viewReviewsEvent.reviews.length / reviewsPerPage)}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
                  <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
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
                    placeholder="e.g. Community Football Match"
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
                  placeholder="Describe your event in detail..."
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
                    placeholder="Chi Lang Stadium"
                    required
                  />
                </div>
              </div>

              {/* Event Banner Image */}
              <div className="modal-form-group full-width">
                <label htmlFor="image">Event Banner</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
                {formData.image && (
                  <p className="file-selected-label">Selected file: {formData.image.name}</p>
                )}

                {editingEvent && !formData.image && editingEvent.image && (
                  <div className="current-image-preview-wrapper">
                    <p className="file-selected-label">Current image:</p>
                    <img
                      src={resolveImageUrl(editingEvent.image)}
                      alt={editingEvent.name || 'Event banner'}
                      className="current-image-preview"
                      style={{ maxWidth: '320px', maxHeight: '180px', display: 'block', marginTop: '8px' }}
                    />
                  </div>
                )}
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
                            placeholder="Field name (e.g. Reason to attend)"
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
                    <option value="draft">Draft</option>
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
                      <span className="btn-spinner"></span> Saving...
                    </>
                  ) : (
                    editingEvent ? 'Save changes' : 'Register Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Event Details Modal */}
      {viewEvent && (
        <div className="event-modal-overlay" onClick={handleCloseViewModal}>
          <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <div className="header-title-wrapper">
                <div className="header-icon-box">
                  <i className="bi bi-eye"></i>
                </div>
                <div className="header-text">
                  <h2>Event Details</h2>
                  <p>Review the published event information.</p>
                </div>
              </div>
              <button className="modal-close-x" onClick={handleCloseViewModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="event-view-content">
              {viewEvent.image && (
                <div className="event-detail-image">
                  <img src={resolveImageUrl(viewEvent.image)} alt={viewEvent.name} />
                </div>
              )}
              <div className="event-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span>{viewEvent.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span>{viewEvent.category?.name || 'Unknown'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date & Time</span>
                  <span>{formatDateTimeForTable(viewEvent.date_time)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span>{viewEvent.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span>{viewEvent.event_type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Capacity</span>
                  <span>{viewEvent.capacity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span>{viewEvent.status}</span>
                </div>
              </div>
              <div className="event-detail-description">
                <h3>Description</h3>
                <p>{viewEvent.description || 'No description provided.'}</p>
              </div>
            </div>
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
            <h3>Confirm Event Deletion</h3>
            <p>Are you sure you want to delete the event "{deleteConfirm.name}"? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
