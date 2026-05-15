import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  const handlePostNotice = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "notices"), {
        title: noticeTitle,
        content: noticeContent,
        createdAt: new Date().toISOString(),
        author: currentUser.email
      });
      alert(`Notice Posted: ${noticeTitle}`);
      setNoticeTitle('');
      setNoticeContent('');
    } catch (error) {
      console.error("Error posting notice: ", error);
      alert("Failed to post notice.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Administrator ({currentUser?.email})</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card span-2">
          <h3>Student Management Quick Stats</h3>
          <div className="stats-row">
            <div className="stat-box">
              <h4>Total Students</h4>
              <p>1,245</p>
            </div>
            <div className="stat-box">
              <h4>Pending Registrations</h4>
              <p>12</p>
            </div>
            <div className="stat-box">
              <h4>Average Attendance</h4>
              <p>92%</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Post a Notice</h3>
          <form onSubmit={handlePostNotice} className="notice-form">
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                required
                placeholder="Notice title"
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea 
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                required
                placeholder="Notice details..."
                rows="4"
              ></textarea>
            </div>
            <button type="submit" className="btn-primary">Post Notice</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
