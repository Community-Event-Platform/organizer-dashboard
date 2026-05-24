// src/pages/Dashboard/CategoryTable.jsx

const CategoryTable = ({ categories, loading, onEdit, onDelete, getCategoryIcon }) => {
  if (loading) {
    return (
      <table className="dashboard-table">
        <tbody>
          <tr>
            <td colSpan="4" className="table-loading">
              <div className="loading-spinner"></div>
              <span>Loading data...</span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (categories.length === 0) {
    return (
      <table className="dashboard-table">
        <tbody>
          <tr>
            <td colSpan="4" className="table-empty">
              <i className="bi bi-inbox"></i>
              <span>No categories yet. Add your first category!</span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
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
        {categories.map((cat) => {
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
                  onClick={() => onEdit(cat)}
                >
                  <i className="bi bi-pencil-square"></i> Edit
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => onDelete(cat)}
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CategoryTable;