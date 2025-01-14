import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1>PDF Tool Home</h1>
      <div style={styles.boxContainer}>
        <Link to="/merge" style={styles.linkBox}>
          Merge PDF
        </Link>
        <Link to="/unlock" style={styles.linkBox}>
          Unlock PDF
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px'
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px'
  },
  linkBox: {
    display: 'inline-block',
    width: '150px',
    height: '100px',
    lineHeight: '100px',
    backgroundColor: '#007BFF',
    color: '#ffffff',
    textDecoration: 'none',
    margin: '0 20px',
    borderRadius: '8px',
    fontSize: '18px'
  }
};

export default HomePage;
