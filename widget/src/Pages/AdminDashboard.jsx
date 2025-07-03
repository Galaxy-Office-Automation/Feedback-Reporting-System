import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import Login from './Login';

const AdminDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (token) {
      fetchFeedback();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:3001/feedback-list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbackList(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch feedback.');
    }
  };

  const handleLogin = (jwt) => {
    setToken(jwt);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  const filteredData = filterTag
    ? feedbackList.filter((item) => item.tag === filterTag)
    : feedbackList;

  return (
    <div className="admin-dashboard">
      <h2>📋 Feedback Viewer</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <div className="filter-bar">
        <label>Filter by Tag:</label>
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
          <option value="">All</option>
          <option value="UI-Bug">UI Bug</option>
          <option value="Content">Content</option>
          <option value="Idea">Idea</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Note</th>
            <th>Tag</th>
            <th>Page URL</th>
            <th>User Agent</th>
            <th>Date</th>
            <th>Status</th>
            <th>Screenshot</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((fb) => (
            <tr key={fb._id}>
              <td>{fb.note}</td>
              <td>{fb.tag}</td>
              <td><a href={fb.url} target="_blank" rel="noreferrer">{fb.url}</a></td>
              <td className="ua">{fb.userAgent}</td>
              <td>{new Date(fb.createdAt).toLocaleString()}</td>
              <td>
                <select
                  value={fb.status || 'Open'}
                  onChange={async (e) => {
                    try {
                      await axios.patch(
                        `http://localhost:3001/feedback/${fb._id}/status`,
                        { status: e.target.value },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      fetchFeedback();
                    } catch (err) {
                      alert('Failed to update status');
                    }
                  }}
                >
                  <option value="Open">Open</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Done">Done</option>
                </select>
              </td>
              <td>
                {fb.screenshot ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(`http://localhost:3001/feedback/screenshot/${fb.screenshot}`);
                      setModalOpen(true);
                    }}
                  >
                    View
                  </button>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModalOpen(false)}>X</button>
            <img src={selectedImage} alt="Screenshot" style={{ maxWidth: '90vw', maxHeight: '80vh' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
