import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthenticated, logout, setLoading } from '../redux/authSlice.js';

const AuthGuard = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only make the API call if isAuthenticated is null (initial load)
    if (isAuthenticated === null) {
      dispatch(setLoading(true));
      axios.get('/api/v1/users/userDetails/')
        .then(response => {
          if (response.status === 200) {
            dispatch(setAuthenticated(response.data));
          } else {
            dispatch(logout());
          }
        })
        .catch(() => {
          dispatch(logout());
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, isAuthenticated]);

  if (loading || isAuthenticated === null) {
    return <div>Loading...</div>; // or any loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign_in" replace />;
  }

  return children;
};

export default AuthGuard;
