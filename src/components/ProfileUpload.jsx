import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

const ProfileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // SECURE MODE: Strict File Validation
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 2;

  const handleFileChange = (e) => {
    setError('');
    setSuccess(false);
    setFile(null);

    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // 1. Validate File Extension & MIME Type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(`SECURITY ALERT: Blocked malicious file attempt. Only JPG, PNG, and WebP are allowed. (Detected: ${selectedFile.type || 'unknown'})`);
      return;
    }

    // 2. Validate File Size
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    // If it passes all security checks:
    setFile(selectedFile);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    // Frontend Simulation of a successful upload
    console.log("🔒 SECURITY CHECK PASSED: Uploading valid file ->", file.name);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 3000);
  };

  return (
    <div className="dashboard-card profile-upload-card">
      <h3>Profile Picture Update</h3>
      <p className="subtitle">Upload a new avatar (Max {MAX_SIZE_MB}MB, Images only)</p>
      
      <form onSubmit={handleUpload} className="upload-form">
        <div 
          className="upload-dropzone"
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud className="upload-icon" size={32} />
          <p>Click to select an image file</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            className="hidden-input"
            // Adding 'accept' provides a first layer of defense, but backend/JS validation is the real shield
            accept=".jpg,.jpeg,.png,.webp" 
          />
        </div>

        {file && !error && (
          <div className="file-preview">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}

        {error && (
          <div className="auth-error upload-alert">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-alert">
            <CheckCircle size={18} />
            <span>Successfully uploaded and secured!</span>
          </div>
        )}

        <button type="submit" disabled={!file || !!error} className="btn-primary mt-3">
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default ProfileUpload;
