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

import consumer from "./cable/consumer"







class EditInterface extends React.Component {
  constructor(props) {
    super(props);

    this.introDialogRef = React.createRef();








console.log("loading notif channel js");

consumer.subscriptions.create({channel: "NotifChannel", video_id: 1}, {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("cable connected");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
  }
});







  }

  componentDidMount = () => {
    if (this.props.match.params.videoID) {
      this.props.setVideoID( this.props.match.params.videoID );
    }
    this.introDialogRef.current?.showModal();
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

        <dialog
          id="introDialog"
          ref={this.introDialogRef}
          style={{ inset: "20%", zIndex: 1, }}>
          <div style={{fontSize: "180%",}}>
            <h1>Getting Started</h1>
            <p>
              To record a riff, press and hold the R key. Recording occurs while the key is held down.
            </p>
            <p>
              To create a new text riff, press and hold the T key.
            </p>
            <p>
              You can add audio to a text riff, or remove audio and use only text, at any time.
            </p>
            <p>
              ⇥ means &quot;jump to&quot;
            </p>
            <p>
              ✎ means &quot;edit&quot;
            </p>
            <p>
              🗑 means &quot;delete&quot;
            </p>
            <p>
              Adjust the timing by 0.5 seconds with the up and down arrows.
            </p>
            <form method="dialog">
              <button>OK</button>
            </form>
          </div>
        </dialog>

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
