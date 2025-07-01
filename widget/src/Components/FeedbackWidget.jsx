import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import './FeedbackWidget.css';

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [tag, setTag] = useState('UI-Bug');
  const [loading, setLoading] = useState(false);

  const toggleWidget = () => setIsOpen(!isOpen);

  // Capture logs into memory
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    logs.push(args.map(String).join(' '));
    originalLog(...args);
  };

  const handleSubmit = async () => {
    if (!note.trim()) return alert('Please enter a note');
    setLoading(true);

    try {
      // Hide widget temporarily before screenshot
      const widget = document.querySelector('.feedback-modal');
      if (widget) widget.style.display = 'none';

      const canvas = await html2canvas(document.body);
      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      const blob = await (await fetch(imgData)).blob();

      if (widget) widget.style.display = ''; // Show it again

      const metadata = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        consoleLogs: logs,
        custom: window.FEEDBACK_META || {},
      };

      const formData = new FormData();
      formData.append('note', note);
      formData.append('tag', tag);
      formData.append('metadata', JSON.stringify(metadata));
      formData.append('screenshot', blob, 'screenshot.jpg');

      await axios.post('http://localhost:3001/feedback', formData);

      alert('✅ Feedback submitted!');
      setNote('');
      setIsOpen(false);
    } catch (error) {
      console.error('❌ Submission failed:', error);
      alert('❌ Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="feedback-modal">
          <h3>Submit Feedback</h3>
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="UI-Bug">UI Bug</option>
            <option value="Content">Content</option>
            <option value="Idea">Idea</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            maxLength={140}
            placeholder="Describe the issue..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button onClick={toggleWidget}>Cancel</button>
        </div>
      )}
      <button className="feedback-button" onClick={toggleWidget}>💬</button>
    </>
  );
};

export default FeedbackWidget;
