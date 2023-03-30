import React from 'react';
import EditInterface from './components/RiffControls/EditInterface';
import ViewInterface from './components/ViewInterface/ViewInterface';
import LandingPage from './components/LandingPage.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import About from './components/About';
import Account from './components/Account';
import Profile from './components/Profile';
import Signup from './components/Signup';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="main-section">
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/riff" component={EditInterface} />
            <Route exact path="/riff/:videoID" component={EditInterface} />
            <Route exact path="/about" component={About} />
            <Route exact path="/view/:videoID" component={ViewInterface} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/profile/:userID" component={Profile} />
            <Route exact path="/signup" component={Signup} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
