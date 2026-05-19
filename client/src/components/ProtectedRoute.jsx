import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Look for our session token in localStorage
  const isAuthenticated = localStorage.getItem('userToken');

  // If the user isn't logged in, redirect them back to the login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If they are logged in, let them pass through to the page
  return children;
};

export default ProtectedRoute;