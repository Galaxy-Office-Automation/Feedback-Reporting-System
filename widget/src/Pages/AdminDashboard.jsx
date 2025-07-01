import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:3001/feedback-list');
      setFeedbackList(res.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const filteredData = filterTag
    ? feedbackList.filter((item) => item.tag === filterTag)
    : feedbackList;

  return (
    <div className="admin-dashboard">
      <h2>📋 Feedback Viewer</h2>

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
                {fb.screenshot ? (
                  <a href={fb.screenshot} target="_blank" rel="noreferrer">View</a>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
