import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import "./nav.scss";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, handleLogout, handleGoogleSignIn } = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    const success = await handleLogout();

    if (success) {
      setMenuOpen(false);
      navigate("/");
    }
  };

  const handleProtectedNavigation = async (event, path) => {
    if (user) {
      setMenuOpen(false);
      return;
    }

    event.preventDefault();

    const signedInUser = await handleGoogleSignIn();

    if (signedInUser) {
      setMenuOpen(false);
      navigate(path);
    }
  };

  const onSignIn = async () => {
    const signedInUser = await handleGoogleSignIn();

    if (signedInUser) {
      setMenuOpen(false);
      navigate("/analyze");
    }
  };

  const initials = (user?.displayName || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <nav className="app-nav">
      <Link
        to="/"
        className="app-nav__brand"
        onClick={() => setMenuOpen(false)}
      >
        <span className="app-nav__logo">G</span>
        <span className="app-nav__name">GapForge</span>
      </Link>

      <button
        className={`app-nav__menu-btn ${
          menuOpen ? "app-nav__menu-btn--open" : ""
        }`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        className={`app-nav__content ${
          menuOpen ? "app-nav__content--open" : ""
        }`}
      >
        <div className="app-nav__links">
          <NavLink
            to="/analyze"
            onClick={(event) => handleProtectedNavigation(event, "/analyze")}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Analyze
          </NavLink>

          <NavLink
            to="/history"
            onClick={(event) => handleProtectedNavigation(event, "/history")}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            History
          </NavLink>
        </div>

        <div className="app-nav__actions">
          {user ? (
            <>
              <div className="app-nav__profile">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Profile"}
                  />
                ) : (
                  <span className="app-nav__avatar">{initials}</span>
                )}

                <span className="app-nav__email">{user.email}</span>
              </div>

              <button className="app-nav__signout" onClick={onSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <button className="app-nav__signout" onClick={onSignIn}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
