import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { registerSchema } from '../utils/validation';
import DOMPurify from 'dompurify';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sanitize input
      console.log("🔒 SECURITY DEMO: Analyzing input for XSS...");
      console.log("Raw Full Name Input:", formData.fullName);
      
      const sanitizedFullName = DOMPurify.sanitize(formData.fullName);
      
      if (formData.fullName !== sanitizedFullName) {
        console.warn("⚠️ MALICIOUS PAYLOAD DETECTED AND STRIPPED!");
        // Instead of silently continuing, we explicitly block it to show a clear demo
        throw new Error("SECURITY ALERT: Malicious XSS script detected in Full Name! Registration blocked.");
      }
      console.log("Sanitized Full Name Output:", sanitizedFullName);

      const sanitizedData = {
        fullName: sanitizedFullName,
        email: DOMPurify.sanitize(formData.email),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      // 2. Validate input using Zod
      const validatedData = registerSchema.parse(sanitizedData);

      // 3. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, validatedData.email, validatedData.password);
      const user = userCredential.user;

      // 4. Create user profile in Firestore
      // By default, assigning 'student' role. Admin role can be assigned manually via Firestore.
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: validatedData.fullName,
        email: validatedData.email,
        role: "student",
        createdAt: new Date().toISOString()
      });

      navigate('/dashboard');

    } catch (err) {
      if (err.errors) {
        // Zod validation error
        setError(err.errors[0].message);
      } else {
        setError(err.message || "Failed to register.");
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = calculatePasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ff4d4d', '#ffa64d', '#ffff4d', '#4dff4d'];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us as a student</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName"
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Create a strong password"
            />
            {formData.password && (
              <div className="password-strength-meter">
                <div 
                  className="strength-bar" 
                  style={{ 
                    width: `${(strength / 4) * 100}%`,
                    backgroundColor: strengthColors[strength - 1] || '#ccc'
                  }}
                ></div>
                <span className="strength-label">{strength > 0 ? strengthLabels[strength - 1] : ''}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
