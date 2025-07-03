import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FeedbackWidget from './Components/FeedbackWidget';
import './Components/FeedbackWidget.css';

// Mount the main app (with routing) to #root
const rootDiv = document.getElementById('root');
if (rootDiv) {
  ReactDOM.createRoot(rootDiv).render(<App />);
}



// Widget embedding logic (for injection on other sites)
window.injectFeedbackWidget = () => {
  if (document.getElementById('feedback-root')) return;

  // Inject CSS if not already present
  if (!document.getElementById('feedback-widget-css')) {
    const link = document.createElement('link');
    link.id = 'feedback-widget-css';
    link.rel = 'stylesheet';
    link.href = '/embed/feedback-sdk.css';
    document.head.appendChild(link);
  }

  const div = document.createElement('div');
  div.id = 'feedback-root';
  document.body.appendChild(div);
  ReactDOM.createRoot(div).render(<FeedbackWidget />);
};

// Optional: Show widget in dev mode, but NOT on /admin or any /admin subroute
if (import.meta.env.DEV && !window.location.pathname.startsWith('/admin')) {
  window.injectFeedbackWidget();
}
