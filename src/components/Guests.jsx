import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css'; // Reuse table styles

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const token = localStorage.getItem('token');
        // We'll need an endpoint for this. For now, we'll fetch all guests.
        const response = await fetch('http://localhost:8000/api/guests', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        const result = await response.json();
        setGuests(result.data || []);
      } catch (err) {
        console.error('Error fetching guests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'attended': return 'bg-success';
      case 'confirmed': return 'bg-primary';
      case 'pending': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="dashboard-container py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Guest Management</h2>
          <button className="btn btn-primary fw-bold">
            <i className="bi bi-person-plus me-2"></i> Add New Guest
          </button>
        </div>

        <div className="categories-card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest Name</th>
                <th>Email</th>
                <th>Event</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5">Loading guests...</td></tr>
              ) : guests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">No guests found. Start by adding one or sharing your event link!</td></tr>
              ) : guests.map((guest) => (
                <tr key={guest.id}>
                  <td>{guest.id}</td>
                  <td><span className="fw-bold">{guest.name}</span></td>
                  <td>{guest.email}</td>
                  <td>{guest.event?.name || 'N/A'}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(guest.status)}`}>
                      {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-action btn-edit">Edit</button>
                    <button className="btn btn-action btn-delete">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Guests;
