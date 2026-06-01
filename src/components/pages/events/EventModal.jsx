import CustomFormManager from './CustomFormManager';

const EventModal = ({
  editingEvent,
  categories,
  loadingCats,
  formData,
  handleChange,
  handleSubmit,
  handleEventTypeChange,
  customFields,
  setCustomFields,
  setShowModal,
  resolveImageUrl,
  isSubmitting,
}) => {
  return (
    <div className="event-modal-overlay" onClick={() => setShowModal(false)}>
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
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

        <form onSubmit={handleSubmit} className="event-modal-form">
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

          <div className="registration-type-section full-width">
            <label className="section-label">Ticket & Registration Type</label>
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

            {formData.event_type === 'Free' && (
              <CustomFormManager
                key={editingEvent ? `event-${editingEvent.id}` : 'event-new'}
                initialFields={customFields}
                requireAdditionalInfo={formData.require_additional_info}
                onRequireAdditionalInfoChange={(value) =>
                  handleChange({ target: { name: 'require_additional_info', type: 'checkbox', checked: value } })
                }
                onFieldsChange={setCustomFields}
              />
            )}
          </div>

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
  );
};

export default EventModal;
