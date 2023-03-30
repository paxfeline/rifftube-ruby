import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getGlobalVideoList } from '../actions';

import VideoList from './VideoList';
import NavBar from './NavBar.js';

const LandingPage = ({ globalVideoList, getGlobalVideoList }) => {

  useEffect(() => {
    getGlobalVideoList();
  }, [getGlobalVideoList]);

 return (
  <div className="landing-page">
    <NavBar color="grey" />
    <section className="top-part">
      <div className="landing-page">
        <NavBar />
        <section className="top-part">
          <h2 className="account-section-title">
            Every YouTube movie on RiffTube
          </h2>
          <VideoList videoData={globalVideoList} />
        </section>
      </div>
    </section>
    <section className="bottom-part">
      <footer className="landing-footer">
        Copyright © 2020 - All rights reserved
      </footer>
    </section>
  </div>
 );
};


let mapStateToProps = (state) => ({
  globalVideoList: state.globalVideoList,
});

const mapDispatchToProps = {
  getGlobalVideoList,
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);