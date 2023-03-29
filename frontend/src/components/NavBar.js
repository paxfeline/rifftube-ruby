import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const NavBar = ({ color, loggedIn }) => (
  <nav className="navbar">
    <span className="heading-primary-nav">RiffTube</span>
    <NavLink
      exact
      activeClassName="navbar-link-active"
      style={{ color }}
      to="/"
    >
      Home
    </NavLink>
    <NavLink activeClassName="navbar-link-active" style={{ color }} to="/riff">
      Riff<em>!</em>
    </NavLink>
    <NavLink
      activeClassName="navbar-link-active"
      style={{ color }}
      to="/TheList"
    >
      The List
    </NavLink>
    <NavLink activeClassName="navbar-link-active" style={{ color }} to="/about">
      About
    </NavLink>
    {loggedIn ? 
      (
        <NavLink
          activeClassName="navbar-link-active"
          style={{ color }}
          to="/account"
        >
          My Account
        </NavLink>
      ) : (
        <NavLink
          activeClassName="navbar-link-active"
          style={{ color }}
          to="/signup"
        >
          Signup
        </NavLink>
      )}
  </nav>
);
let mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
});

const mapDispatchToProps = {
  //getPublicUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
