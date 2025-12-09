// Login Page
import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../utils/apiClient";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;   // FIXED
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/login", formData);
      login(response.data.user, response.data.token);

      const returnTo = searchParams.get("returnTo");

      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(returnTo || "/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");  // FIXED
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div className="form-card">
        <h2 style={{fontSize:22,fontWeight:700,textAlign:'center',marginBottom:6}}>Welcome Back</h2>
        <p style={{textAlign:'center',color:'#6b7280',marginBottom:12}}>Login to your account</p>

        {error && <div style={{background:'#fff1f2',border:'1px solid #fecaca',padding:12,borderRadius:8,marginBottom:12}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn" style={{width:'100%'}}>{loading? 'Logging in...':'Login'}</button>
        </form>

        <p style={{textAlign:'center',color:'#6b7280',marginTop:12}}>Don't have an account? <Link to="/register" style={{color:'var(--primary)',fontWeight:700}}>Register here</Link></p>

        <div style={{marginTop:18,borderTop:'1px solid #eef2f7',paddingTop:12}}>
          <p style={{fontSize:12,color:'#6b7280',textAlign:'center',marginBottom:8}}>Demo Credentials</p>
          <button type="button" onClick={() => setFormData({email:'admin@test.com',password:'password123'})} className="btn secondary" style={{width:'100%',marginBottom:8}}>👤 Admin User</button>
          <button type="button" onClick={() => setFormData({email:'customer@test.com',password:'password123'})} className="btn secondary" style={{width:'100%'}}>👨‍💼 Customer User</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
