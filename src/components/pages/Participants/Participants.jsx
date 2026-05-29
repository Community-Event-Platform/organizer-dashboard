/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo, useCallback } from 'react';
import FormResponseModal from './FormResponseModal';
import '../../css/Participants.css';

const API_BASE = 'http://localhost:8000/api';

/**
 * CEP-84: Participants page — displays all participants across organizer's events.
 * Shows waitlist position, status badges, form responses, and pagination.
 */
const Participants = ({ addToast, initialEventId = 'all' }) => {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState(initialEventId);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const PER_PAGE = 10;

  const token = localStorage.getItem('token');

  // ─── Fetch data ────────────────────────────────────────────
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterEvent !== 'all') params.append('event_id', filterEvent);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const res = await fetch(`${API_BASE}/organizer/participants?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const json = await res.json();
      if (res.ok) {
        setParticipants(json.data || []);
      } else {
        addToast(json.message || 'Failed to load participants', 'error');
      }
    } catch {
      addToast('Network error loading participants', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterEvent, filterStatus, addToast, token]);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/organizer/events`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const json = await res.json();
      if (res.ok) setEvents(json.data || []);
    } catch { /* silent */ }
  }, [token]);

  useEffect(() => {
    setFilterEvent(initialEventId);
  }, [initialEventId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchParticipants();
    setPage(1);
  }, [fetchParticipants]);

  // ─── Computed stats ────────────────────────────────────────
  const stats = useMemo(() => ({
    total: participants.length,
    pending: participants.filter(p => p.status === 'Pending').length,
    approved: participants.filter(p => p.status === 'Approved').length,
    waitlisted: participants.filter(p => p.status === 'Waitlisted').length,
    cancelled: participants.filter(p => p.status === 'Cancelled').length,
  }), [participants]);

  // ─── Filter + Search ───────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return participants;
    const q = search.toLowerCase();
    return participants.filter(p =>
      p.attendee?.name?.toLowerCase().includes(q) ||
      p.attendee?.email?.toLowerCase().includes(q) ||
      p.event?.name?.toLowerCase().includes(q)
    );
  }, [participants, search]);

  // ─── Pagination ────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ─── Approve / Reject actions (update status via API) ──────
  const handleApprove = async (registrationId) => {
    try {
      const res = await fetch(`${API_BASE}/registrations/${registrationId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (res.ok) {
        addToast('Participant approved successfully!', 'success');
        setSelectedParticipant(null);
        fetchParticipants();
      } else {
        addToast('Failed to approve participant', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    }
  };

  const handleReject = async (registrationId) => {
    try {
      const res = await fetch(`${API_BASE}/registrations/${registrationId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (res.ok) {
        addToast('Participant rejected.', 'success');
        setSelectedParticipant(null);
        fetchParticipants();
      } else {
        addToast('Failed to reject participant', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    }
  };

  // ─── Helpers ───────────────────────────────────────────────
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
  };

  const avatarColors = ['#14AE5C', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'];
  const getAvatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

  const getBadgeClass = (status) => {
    const map = {
      'Approved': 'p-badge-approved',
      'Waitlisted': 'p-badge-waitlisted',
      'Pending': 'p-badge-pending',
      'Rejected': 'p-badge-rejected',
      'Cancelled': 'p-badge-cancelled',
      'Checked-in': 'p-badge-checkedin',
    };
    return map[status] || 'p-badge-pending';
  };

  const formatDateTime = (dt) => {
    if (!dt) return '';
    const d = new Date(dt);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="participants-page">

      {/* Header */}
      <div className="participants-header">
        <h1>All Participants</h1>
        <p>Manage and monitor participants across all your events.</p>
      </div>

      {/* Stats Row */}
      <div className="participants-stats">
        <div className="stat-card stat-total">
          <span className="stat-label">Total</span>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-sub">All registrations</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-label">Pending</span>
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-sub">Awaiting approval</span>
        </div>
        <div className="stat-card stat-approved">
          <span className="stat-label">Approved</span>
          <span className="stat-number">{stats.approved}</span>
          <span className="stat-sub">Confirmed seats</span>
        </div>
        <div className="stat-card stat-waitlisted">
          <span className="stat-label">Waitlisted</span>
          <span className="stat-number">{stats.waitlisted}</span>
          <span className="stat-sub">In queue</span>
        </div>
        <div className="stat-card stat-cancelled">
          <span className="stat-label">Cancelled</span>
          <span className="stat-number">{stats.cancelled}</span>
          <span className="stat-sub">Dropped out</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="participants-toolbar">
        <div className="participants-search">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder="Search Participants...."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="participants-filter">
          <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}>
            <option value="all">All Event</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.name}</option>
            ))}
          </select>
        </div>

        <div className="participants-filter">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Waitlisted">Waitlisted</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="participants-table-card">
        {loading ? (
          <div className="participants-loading">
            <i className="bi bi-arrow-clockwise" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}></i>
            <p style={{ marginTop: '0.5rem' }}>Loading participants...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="participants-empty">
            <i className="bi bi-people"></i>
            <p>No participants found.</p>
          </div>
        ) : (
          <table className="participants-table">
            <thead>
              <tr>
                <th>Participants</th>
                <th>Events</th>
                <th>Status</th>
                <th>Waitlist Pos</th>
                <th style={{ color: '#14AE5C' }}>Form Responses</th>
                <th>Registered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id}>
                  {/* Participant */}
                  <td>
                    <div className="attendee-cell">
                      {p.attendee?.avatar ? (
                        <img
                          src={p.attendee.avatar}
                          alt={p.attendee.name}
                          className="attendee-avatar"
                        />
                      ) : (
                        <div
                          className="attendee-avatar-placeholder"
                          style={{ background: getAvatarColor(p.attendee?.name) }}
                        >
                          {getInitials(p.attendee?.name)}
                        </div>
                      )}
                      <div className="attendee-info">
                        <div className="attendee-name">{p.attendee?.name}</div>
                        <div className="attendee-email">{p.attendee?.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Event */}
                  <td>
                    <div className="event-cell">
                      <div className="event-name">{p.event?.name}</div>
                      <div className="event-date">{formatDateTime(p.event?.date_time)}</div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`p-badge ${getBadgeClass(p.status)}`}>
                      {p.status === 'Waitlisted' ? 'Waiting' : p.status}
                    </span>
                  </td>

                  {/* Waitlist Position — CEP-84 */}
                  <td>
                    {p.waitlist_position ? (
                      <span className="waitlist-position">{p.waitlist_position}</span>
                    ) : (
                      <span className="waitlist-dash">-</span>
                    )}
                  </td>

                  {/* Form Responses */}
                  <td>
                    {p.has_form_responses ? (
                      <span
                        className="form-response-link"
                        onClick={() => setSelectedParticipant(p)}
                      >
                        [View Answers]
                      </span>
                    ) : (
                      <span className="no-form-text">No form required</span>
                    )}
                  </td>

                  {/* Registered At */}
                  <td>{p.registered_at}</td>

                  {/* Actions */}
                  <td>
                    <div className="action-group">
                      <button
                        className="p-action-btn p-btn-view"
                        onClick={() => setSelectedParticipant(p)}
                        title="View details"
                      >
                        View
                      </button>
                      <button
                        className="p-action-btn p-btn-block"
                        title="Block participant"
                      >
                        Block
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="participants-pagination">
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`page-btn ${page === n ? 'active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Form Response Modal */}
      {selectedParticipant && (
        <FormResponseModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default Participants;
