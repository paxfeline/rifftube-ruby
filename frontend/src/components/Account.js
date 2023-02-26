import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Login from './Login/Login';
import { setRifferName, setRiffPic, getUserData } from '../actions';
import NavBar from './NavBar.js';
import VideoList from './VideoList';

const Account = ({
  name,
  setRifferName,
  setRiffPic,
  userData,
  getUserData,
  user_id,
  acctImgKey,
  loggedIn,
}) => {
  const [userName, setUserName] = useState(name);

  useEffect(() => {
    if (loggedIn) getUserData();
  }, [getUserData, loggedIn]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userName !== '') {
      setRifferName(userName);
    }
  };

  const picSubmit = (event) => {
    event.preventDefault();
    //console.log(event.target.children[0].value);
    setRiffPic(event.target.children[0].files[0]);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setUserName(event.target.value);
  };

  return (
    <div className="landing-page">
      <NavBar />
      <div className="title-and-url heading">
        <h1 className="heading-primary-main account-heading">
          Account Settings
        </h1>
      </div>
      <section className="top-part">
        {loggedIn ? (
          <React.Fragment>
            <h3>
              visit <Link to={`/profile/${user_id}`}>public profile</Link>
            </h3>
            <form onSubmit={(event) => handleSubmit(event)}>
              <label>
                <h3 className="account-section-title">My Riffer Name</h3>
                <input
                  onChange={(event) => handleChange(event)}
                  type="text"
                  name="name"
                  defaultValue={name}
                  className="form-field"
                />
              </label>
              <input type="submit" value="Submit" className="btn" />
            </form>
            <img key={acctImgKey} src={`/get-riffer-pic/${user_id}.png?${acctImgKey}`} />
            <form onSubmit={(event) => picSubmit(event)}>
              <input type="file" name="image" /><br /><br />
              <button type="submit">Upload</button>
            </form>
            <h2 className="account-section-title">My Videos</h2>
            <VideoList userData={userData} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Login /> <p>to get started</p>
          </React.Fragment>
        )}
      </section>
    </div>
  );
};

let mapStateToProps = (state) => ({
  name: state.name,
  userData: state.userData,
  user_id: state.user_id,
  acctImgKey: state.acctImgKey,
  loggedIn: state.loggedIn,
});

const mapDispatchToProps = {
  setRifferName,
  setRiffPic,
  getUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
