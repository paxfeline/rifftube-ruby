import React from 'react';
import { connect } from 'react-redux';
import AuthorSelector from './AuthorSelector';
import { setVideoID, getViewRiffs, setAudioPlayers, setAudioPlayerNotInUse } from '../../actions';
import NavBar from '../NavBar.js';

const queryString = require('query-string');

class ViewInterface extends React.Component {
  componentDidMount = () => {
    this.props.setVideoID(this.props.match.params.videoID);
    this.props.getViewRiffs(this.props.match.params.videoID);

    console.log("setup audio players");
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
    }

    this.props.setAudioPlayers(audioPlayers);
  };

  render = () => {
    const parsed = queryString.parse(this.props.location.search);

    return (
      <React.Fragment>
        <NavBar color="grey" />
        <div style={{ marginTop: '4em', width: '100%' }}>
          <h1>View {this.props.match.params.videoID}</h1>
          <AuthorSelector
            duration={this.props.duration}
            history={this.props.history}
            videoID={this.props.match.params.videoID}
            riffers={parsed.solo}
            riffs={Object.values(this.props.riffs ?? {})}
          />
        </div>
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => ({
  riffs: state.riffs,
  duration: state.duration,
});

const mapDispatchToProps = {
  setVideoID,
  getViewRiffs,
  setAudioPlayers,
  setAudioPlayerNotInUse,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewInterface);
