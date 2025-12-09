// ProtectedRoute Component
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,borderRadius:999,borderBottom:'4px solid var(--primary)',margin:'0 auto',animation:'spin 1s linear infinite'}}></div>
          <p style={{marginTop:12}}>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,borderRadius:999,borderBottom:'4px solid var(--primary)',margin:'0 auto',animation:'spin 1s linear infinite'}}></div>
          <p style={{marginTop:12}}>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/login" replace />;
};
