import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MergePage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mergedFileURL, setMergedFileURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 1) Handle drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // 2) Drag & drop reordering logic
  const handleDragEnd = (result) => {
    if (!result.destination) return; // dropped outside the list

    const newFiles = Array.from(selectedFiles);
    const [movedFile] = newFiles.splice(result.source.index, 1);
    newFiles.splice(result.destination.index, 0, movedFile);

    setSelectedFiles(newFiles);
  };

  // 3) Remove one file from the list
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 4) Merge request
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
  
      const fileURL = URL.createObjectURL(response.data);
      setMergedFileURL(fileURL);
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          // Possibly "One of the PDFs is locked" or "At least two files are required" or "No files provided"
          setErrorMessage(data.error || "Bad request. The PDF may be locked or invalid.");
        } else {
          // Some other status code
          setErrorMessage(data.error || `Server error (status ${status}).`);
        }
      } else {
        // No response or network error
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
          isDragActive
            ? <p>Drop files here ...</p>
            : <p>Drag &amp; drop files here, or click to select</p>
        }
      </div>

      {/* Draggable list */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="filesList">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={styles.fileList}
            >
              {selectedFiles.map((file, index) => (
                <Draggable key={file.name + index} draggableId={file.name + index} index={index}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={{
                        ...styles.fileItem,
                        ...draggableProvided.draggableProps.style
                      }}
                    >
                      <span>{index + 1}. {file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        style={styles.removeButton}
                      >
                        X
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
    marginBottom: '5px',
    backgroundColor: '#fff'
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
