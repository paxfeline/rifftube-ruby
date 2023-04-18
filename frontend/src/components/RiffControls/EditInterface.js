import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import YouTubeVideo from '../YouTubeVideo/YouTubeVideo';
import EditControls from './EditControls';
import {
  setVideoID,
  setWebSocket,
  getRiffsMeta,
  getRiffs,
  setRecorder,
} from '../../actions';
import MetaBar from '../MetaBar';
import NavBar from '../NavBar.js';

class EditInterface extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    if (this.props.match.params.videoID) {
      this.props.setVideoID( this.props.match.params.videoID );
    }
  };

  // watch for video id change
  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.match.params.videoID !== this.props.videoID) {
      this.props.setVideoID( this.props.match.params.videoID );
    }

    if (
      this.props.loggedIn &&
      this.props.videoID &&
      this.props.userInfo !== prevProps.userInfo
    ) {
      this.props.getRiffs(this.props.videoID);
    }

    /*
    if (
      this.props.loggedIn &&
      (!this.props.websocket || this.props.videoID !== prevProps.videoID)
    ) {
      //const websocket = new WebSocket( `ws://localhost:3300/riff?videoID=${this.props.match.params.videoID}&googleToken=${this.props.googleUser.getAuthResponse().id_token}` );
      var baseURL;
      if (process.env.NODE_ENV === 'production')
        baseURL = 'wss://rifftube.herokuapp.com';
      else baseURL = 'ws://localhost:3300';

      const websocket = new WebSocket(
        `${baseURL}/riff?videoID=${
          this.props.match.params.videoID
        }&googleToken=${this.props.googleUser.getAuthResponse().id_token}`
      );
      websocket.onmessage = (event) => {
        console.log(event.data);

        const msg = JSON.parse(event.data);

        if (msg.video_id === this.props.videoID && msg.type === 'update')
          this.props.getRiffsMeta(this.props.videoID);
      };
      this.props.setWebSocket(websocket);
    }
    */
  };

  render() {
    return this.props.match.params.videoID ? (
      <React.Fragment>
        <NavBar color="grey" />
        <div className="youtube-section" style={ {marginTop: "8rem"} }>
          <YouTubeVideo id={this.props.videoID} riffs={this.props.riffs} />
          <MetaBar />
          <div className="view-share-riff-link">
            <a
              href={`/view/${this.props.videoID}${this.props.userInfo ? `?solo=${this.props.userInfo.id}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Riffed Video
            </a>
          </div>
        </div>
        <EditControls history={this.props.history} />
      </React.Fragment>
    ) : (
      <Redirect to={`/riff/${this.props.videoID}`} />
    );
  }
}

const mapStateToProps = (state) => ({
  riffs: state.riffs,
  videoID: state.videoID,
  websocket: state.websocket,
  recorder: state.recorder,

  loggedIn: state.loggedIn,
  userInfo: state.userInfo,
});

const mapDispatchToProps = {
  setVideoID,
  setWebSocket,
  getRiffsMeta,
  getRiffs,
  setRecorder,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditInterface);
