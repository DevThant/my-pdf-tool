import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UnlockPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState("");
  const [unlockedFileURL, setUnlockedFileURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const handleUnlock = async () => {
    try {
      if (!selectedFile) {
        setErrorMessage("Please select a file to unlock");
        return;
      }
      if (!password) {
        setErrorMessage("Please enter the PDF password");
        return;
      }
      setErrorMessage("");
      setUnlockedFileURL(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('password', password);

      const response = await axios.post('/api/unlock', formData, {
        responseType: 'blob'
      });

      const fileURL = URL.createObjectURL(response.data);
      setUnlockedFileURL(fileURL);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while unlocking the file.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Unlock PDF</h2>
      <div
        {...getRootProps()}
        style={{
          ...styles.dropzone,
          borderColor: isDragActive ? '#2196f3' : '#cccccc'
        }}
      >
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the locked PDF here ...</p> :
            <p>Drag &amp; drop your locked PDF here, or click to select</p>
        }
      </div>

      {selectedFile && (
        <div style={styles.fileInfo}>
          <span>File: {selectedFile.name}</span>
        </div>
      )}

      <input
        type="password"
        placeholder="Enter PDF Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.passwordInput}
      />

      <button
        onClick={handleUnlock}
        style={styles.unlockButton}
        disabled={!selectedFile || !password}
      >
        Unlock
      </button>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {unlockedFileURL && (
        <div style={styles.resultContainer}>
          <a
            href={unlockedFileURL}
            download="unlocked.pdf"
            style={styles.downloadLink}
          >
            Download Unlocked PDF
          </a>
          <iframe
            title="PDF Preview"
            src={unlockedFileURL}
            style={styles.previewFrame}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  dropzone: {
    border: '2px dashed #cccccc',
    borderRadius: '5px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  fileInfo: {
    marginTop: '20px'
  },
  passwordInput: {
    display: 'block',
    marginTop: '20px',
    width: '100%',
    padding: '10px',
    fontSize: '16px'
  },
  unlockButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: '10px'
  },
  resultContainer: {
    marginTop: '20px'
  },
  downloadLink: {
    display: 'inline-block',
    marginRight: '20px',
    textDecoration: 'none',
    color: '#007BFF',
    border: '1px solid #007BFF',
    padding: '8px',
    borderRadius: '4px'
  },
  previewFrame: {
    width: '100%',
    height: '500px',
    marginTop: '20px',
    border: '1px solid #ccc'
  }
};

export default UnlockPage;
