import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InboxPage from './pages/InboxPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  // Auto-authenticate for demo purposes
  React.useEffect(() => {
    if (!isAuthenticated) {
      useAuthStore.getState().login('demo@example.com', 'demo123');
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<InboxPage />} />
      <Route path="/inbox" element={<InboxPage />} />
    </Routes>
  );
}

export default App;