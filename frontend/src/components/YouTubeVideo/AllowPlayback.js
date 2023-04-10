import React from 'react';
import { connect } from 'react-redux';
import {
  setPlayerMode,
  setAudioPlayers,
  setAudioPlayerInUse,
  setAudioPlayerNotInUse,
  PLAY_MODE
} from '../../actions/index.js';

class AllowPlayback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allowed: false };
  }

  componentDidMount = () => {
    var test = new Audio();
    test.controls = false;
    test.src = '/dingdong.wav';
    test
      .play()
      .then(() => {
        this.setupAudioPlayers();
      })
      .catch(() => {
        console.error('playback not allowed');
      });
  };

  setupAudioPlayers = () => {
    this.setState({ allowed: true });
    let audioPlayers = [];
    let audioPlayersCount = 5;
    for (let i = 0; i < audioPlayersCount; i++) {

      audioPlayers[i] = new Audio(); // should be identical behavior to: document.createElement('audio');
      audioPlayers[i].controls = false;
      audioPlayers[i].addEventListener('ended', () =>
      {
        console.log('audio playback end', i);
        this.props.setAudioPlayerNotInUse(i);
      });

      /* unsure... maybe not needed
      let se = document.createElement('source');
      window.audioPlayers[i].appendChild(se);
      window.audioPlayers[i].srcEl = se;
      */
    }

    this.props.setAudioPlayers(audioPlayers);
  };

  render = () => {
    //if (!this.state) return null;

    return !this.state.allowed ? (
      <div
        className="audio-capture"
        onClick={() => {
          console.log("allow playback");
          this.setupAudioPlayers();
          this.props.setPlayerMode(PLAY_MODE);
        }}
      />
    ) : null;
  };
}

const mapStateToProps = (state) => ({
  audioPlayerInUse: state.audioPlayerInUse,
});

const mapDispatchToProps = {
  setPlayerMode,
  setAudioPlayers,
  setAudioPlayerInUse,
  setAudioPlayerNotInUse,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllowPlayback);
