import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MergePage from './pages/MergePage';
import UnlockPage from './pages/UnlockPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/merge" element={<MergePage />} />
        <Route path="/unlock" element={<UnlockPage />} />
      </Routes>
    </Router>
  );
}

export default App;
