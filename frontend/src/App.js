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
      <div style={styles.navbar}>
        <div style={styles.navbarInner}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/merge" style={styles.navLink}>Merge</Link>
          <Link to="/unlock" style={styles.navLink}>Unlock</Link>
        </div>
      </div>

      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="/unlock" element={<UnlockPage />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#343a40',
    padding: '10px',
  },
  navbarInner: {
    maxWidth: '960px',
    margin: '0 auto',
    display: 'flex',
    gap: '20px'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px'
  },
  content: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '20px'
  }
};

export default App;
