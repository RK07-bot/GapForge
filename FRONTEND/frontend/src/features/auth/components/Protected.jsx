import React from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Navigate, Outlet } from "react-router-dom";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loader">
        {" "}
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/"} />;
  }

  return children ? children : <Outlet />;
};

export default Protected;