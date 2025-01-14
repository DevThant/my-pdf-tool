import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const MergePage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mergedFileURL, setMergedFileURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = (acceptedFiles) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    try {
      if (selectedFiles.length < 2) {
        setErrorMessage("Please select at least 2 files to merge");
        return;
      }
      setErrorMessage("");
      setMergedFileURL(null);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post('/api/merge', formData, {
        responseType: 'blob'
      });

      // Convert blob to URL
      const fileURL = URL.createObjectURL(response.data);
      setMergedFileURL(fileURL);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while merging the files.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Merge PDF</h2>
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
            <p>Drop files here ...</p> :
            <p>Drag &amp; drop files here, or click to select</p>
        }
      </div>

      <div style={styles.fileList}>
        {selectedFiles.map((file, index) => (
          <div key={index} style={styles.fileItem}>
            <span>{index + 1}. {file.name}</span>
            <button onClick={() => handleRemoveFile(index)} style={styles.removeButton}>X</button>
          </div>
        ))}
      </div>

      <button
        onClick={handleMerge}
        style={styles.mergeButton}
        disabled={selectedFiles.length < 2}
      >
        Merge
      </button>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {mergedFileURL && (
        <div style={styles.resultContainer}>
          <a
            href={mergedFileURL}
            download="merged.pdf"
            style={styles.downloadLink}
          >
            Download Merged PDF
          </a>
          <iframe
            title="PDF Preview"
            src={mergedFileURL}
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
  fileList: {
    marginTop: '20px'
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '1px solid #ccc',
    padding: '5px',
    marginBottom: '5px'
  },
  removeButton: {
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  mergeButton: {
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

export default MergePage;
