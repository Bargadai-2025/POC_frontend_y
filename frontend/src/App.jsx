import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please upload an Excel file (.xlsx or .xls)');
        setFile(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setFile(droppedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/process-excel',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minutes timeout
        }
      );

      setResult(response.data);
      setUploading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleDownload = () => {
    if (result?.download_url) {
      window.open(`http://127.0.0.1:8000${result.download_url}`, '_blank');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>🔍 Fraud Detection Bulk Processor</h1>
          <p>Upload Excel with email and phone columns</p>
        </div>

        {!result ? (
          <div className="upload-section">
            <div
              className={`dropzone ${file ? 'has-file' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="file-input"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {!file ? (
                <label htmlFor="file-input" className="upload-label">
                  <div className="upload-icon">📄</div>
                  <p className="upload-text">Drag & drop Excel file here</p>
                  <p className="upload-subtext">or click to browse</p>
                  <p className="upload-hint">Supports .xlsx and .xls files</p>
                </label>
              ) : (
                <div className="file-info">
                  <div className="file-icon">✅</div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                  <button onClick={handleReset} className="btn-remove">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            {file && !uploading && (
              <button onClick={handleUpload} className="btn-primary">
                🚀 Process Excel File
              </button>
            )}

            {uploading && (
              <div className="processing">
                <div className="spinner"></div>
                <p className="processing-text">Processing your file...</p>
                <p className="processing-subtext">This may take a few moments</p>
              </div>
            )}
          </div>
        ) : (
          <div className="result-section">
            <div className="success-icon">✅</div>
            <h2>Processing Complete!</h2>
            
            <div className="stats">
              <div className="stat-card">
                <div className="stat-number">{result.summary.total_rows}</div>
                <div className="stat-label">Total Rows</div>
              </div>
              <div className="stat-card success">
                <div className="stat-number">{result.summary.success}</div>
                <div className="stat-label">Successful</div>
              </div>
              <div className="stat-card incomplete">
                <div className="stat-number">{result.summary.incomplete ?? 0}</div>
                <div className="stat-label">Incomplete</div>
              </div>
              <div className="stat-card failed">
                <div className="stat-number">{result.summary.failed}</div>
                <div className="stat-label">Failed</div>
              </div>
            </div>

            <div className="button-group">
              <button onClick={handleDownload} className="btn-download">
                📥 Download Result
              </button>
              <button onClick={handleReset} className="btn-secondary">
                🔄 Process Another File
              </button>
            </div>

            <div className="job-info">
              <p>Job ID: <code>{result.job_id}</code></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
