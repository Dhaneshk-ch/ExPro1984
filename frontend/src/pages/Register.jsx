// Register Page
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../utils/apiClient";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/auth/register", formData);

      // Login user after successful registration
      login(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div className="form-card">
        <h2 style={{fontSize:22,fontWeight:700,textAlign:'center',marginBottom:6}}>Create Account</h2>
        <p style={{textAlign:'center',color:'#6b7280',marginBottom:12}}>Join ExPro today</p>

        {error && <div style={{background:'#fff1f2',border:'1px solid #fecaca',padding:12,borderRadius:8,marginBottom:12}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn" style={{width:'100%'}}>{loading? 'Creating account...':'Register'}</button>
        </form>

        <p style={{textAlign:'center',color:'#6b7280',marginTop:12}}>Already have an account? <Link to="/login" style={{color:'var(--success)',fontWeight:700}}>Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;
