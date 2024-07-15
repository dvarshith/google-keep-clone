import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
  
    if (isAuthenticated === null) {
      return <p>Loading...</p>;
    }
    console.log("Protected Route: " + isAuthenticated);
    if (isAuthenticated === true) {
      return children;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

export default ProtectedRoute;