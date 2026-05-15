import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ProfileUpload from '../components/ProfileUpload';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = [];
      snapshot.forEach((doc) => {
        noticesData.push({ id: doc.id, ...doc.data() });
      });
      setNotices(noticesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, {currentUser?.email}</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Grades</h3>
          <ul className="list-group">
            <li className="list-item">
              <span>Mathematics</span>
              <span className="badge badge-success">A</span>
            </li>
            <li className="list-item">
              <span>Physics</span>
              <span className="badge badge-success">A-</span>
            </li>
            <li className="list-item">
              <span>History</span>
              <span className="badge badge-warning">B+</span>
            </li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3>Attendance Overview</h3>
          <div className="stat-circle">
            <span className="stat-number">95%</span>
            <span className="stat-label">Present</span>
          </div>
        </div>

        <ProfileUpload />

        <div className="dashboard-card">
          <h3>Recent Notices</h3>
          {notices.length === 0 ? (
            <p>No notices available.</p>
          ) : (
            notices.map((notice) => (
              <div key={notice.id} className="notice-item">
                <h4>{notice.title}</h4>
                <p>{notice.content}</p>
                <small>Posted on {new Date(notice.createdAt).toLocaleDateString()} by {notice.author}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
