import { useState, useEffect, useCallback } from 'react';
import { getCategories, getOrganizerEvents, createEvent, updateEvent, deleteEvent, endEvent } from '../../../services/api';
import DeleteConfirmModal from './DeleteConfirmModal';
import EventModal from './EventModal';
import ReviewModal from './ReviewModal';
import ViewEventModal from './ViewEventModal';
import '../../css/Events.css';

/**
 * Events Component - Displays a table of all events and a modal for creation/edition
 */
const Events = ({ addToast, onNavigateToParticipants }) => {
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

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customFields, setCustomFields] = useState([]);
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
      require_additional_info: type === 'Free' ? prev.require_additional_info : false,
    }));
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
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    if (cleanPath.startsWith('storage/')) {
      return `${apiBase}/${cleanPath}`;
    }

    if (cleanPath.startsWith('events/')) {
      return `${apiBase}/storage/${cleanPath}`;
    }

    return `${apiBase}/storage/events/${cleanPath}`;
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

  const handleEndEvent = async (eventId) => {
    try {
      await endEvent(eventId);
      if (addToast) addToast('Sự kiện đã được kết thúc thành công.', 'success');
      await fetchEvents();
      handleCloseViewModal();
    } catch (error) {
      console.error('Error ending event:', error);
      if (addToast) addToast(error.response?.data?.message || 'Unable to end event.', 'error');
    }
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
                        <>
                          <button className="btn-view" onClick={() => handleOpenViewModal(event)} title="View details">
                            <i className="bi bi-eye"></i>
                          </button>
                          {event.status?.toLowerCase() !== 'ended' && (
                            <button 
                              className="btn-end-event-table" 
                              onClick={() => handleEndEvent(event.id)} 
                              title="End event"
                            >
                              <i className="bi bi-flag-fill"></i>
                            </button>
                          )}
                        </>
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

      <ReviewModal
        viewReviewsEvent={viewReviewsEvent}
        reviewsPage={reviewsPage}
        setReviewsPage={setReviewsPage}
        onClose={() => setViewReviewsEvent(null)}
      />

      {showModal && (
        <EventModal
          editingEvent={editingEvent}
          categories={categories}
          loadingCats={loadingCats}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleEventTypeChange={handleEventTypeChange}
          customFields={customFields}
          setCustomFields={setCustomFields}
          setShowModal={setShowModal}
          resolveImageUrl={resolveImageUrl}
          isSubmitting={isSubmitting}
        />
      )}

      <ViewEventModal
        viewEvent={viewEvent}
        onClose={handleCloseViewModal}
        resolveImageUrl={resolveImageUrl}
        formatDateTimeForTable={formatDateTimeForTable}
        onNavigateToParticipants={() => {
          handleCloseViewModal();
          if (onNavigateToParticipants) onNavigateToParticipants(viewEvent.id);
        }}
        onEndEvent={handleEndEvent}
      />

      <DeleteConfirmModal
        deleteConfirm={deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Events;
