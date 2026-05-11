import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    stats: { total_events: 0, total_participants: 0, active_events: 0 },
    categories: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getCategoryIcon = (name) => {
    const icons = {
      'Music': { icon: 'bi-music-note-beamed', class: 'bg-purple-light' },
      'Sports': { icon: 'bi-dribbble', class: 'bg-orange-light' },
      'Community': { icon: 'bi-people-fill', class: 'bg-blue-light' },
    };
    return icons[name] || { icon: 'bi-tag', class: 'bg-secondary-light' };
  };

  const stats = [
    { id: 1, label: 'Toatal Events', value: data.stats.total_events, icon: 'bi-calendar-event', colorClass: 'icon-blue' },
    { id: 2, label: 'Participants', value: data.stats.total_participants, icon: 'bi-people', colorClass: 'icon-orange' },
    { id: 3, label: 'Active Events', value: data.stats.active_events, icon: 'bi-graph-up-arrow', colorClass: 'icon-green' },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Dashboard Hero */}
      <div className="dashboard-hero">
        <div className="container">
          <h1>Chào mừng bạn đến với <br/>Event organizer</h1>
          <p>Quản lý và theo dõi các sự kiện của bạn</p>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="container">
          {/* Stats Section */}
          <section className="mb-5">
            <h2 className="section-title">Dashboard Overview</h2>
            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.id} className="stat-card">
                  <div className={`stat-icon-wrapper ${stat.colorClass}`}>
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Categories Section */}
          <section>
            <h2 className="section-title">Events Categories</h2>
            <div className="categories-card">
              <table className="table">
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
                    <tr><td colSpan="4" className="text-center py-5">Loading data...</td></tr>
                  ) : data.categories.map((cat) => {
                    const iconData = getCategoryIcon(cat.name);
                    return (
                      <tr key={cat.id}>
                        <td>{cat.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className={`category-icon ${iconData.class}`}>
                              <i className={`bi ${iconData.icon}`}></i>
                            </div>
                            <span>{cat.name}</span>
                          </div>
                        </td>
                        <td className="fw-bold text-center">{cat.events_count || 0}</td>
                        <td className="text-end">
                          <button className="btn btn-action btn-edit">
                            <i className="bi bi-pencil-square me-1"></i> Edit
                          </button>
                          <button className="btn btn-action btn-delete">
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
