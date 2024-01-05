import React from 'react';
import { connect } from 'react-redux';
import AuthorSelector from './AuthorSelector';
import { setVideoID, getViewRiffs, setAudioPlayers, setAudioPlayerNotInUse } from '../../actions';
import NavBar from '../NavBar.js';

const queryString = require('query-string');

class ViewInterface extends React.Component {
  constructor(props) {
    super(props);

    this.introDialogRef = React.createRef();
  }

  setupAudioPlayers = () =>
  {
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

  componentDidMount = () => {
    this.props.setVideoID(this.props.match.params.videoID);
    this.props.getViewRiffs(this.props.match.params.videoID);

    this.introDialogRef.current?.showModal();
  };

  render = () => {
    const parsed = queryString.parse(this.props.location.search);

    return (
      <React.Fragment>
        <NavBar color="grey" />

        <dialog
          id="introDialog"
          ref={this.introDialogRef}
          style={{ inset: "20%", zIndex: 1, }}>
          <div style={{fontSize: "180%",}}>
            <h1>Riffers:</h1>
            {
              this.props.riffs && Object.values(this.props.riffs).length > 0 ?
                <p dangerouslySetInnerHTML={{__html:
                    Object.values(this.props.riffs)
                    .map(({name, user_id: id}) => ({name, id})) // fun with destructuring and implicit return
                    .reduce((acc, cur) => {if (!acc.find(({id}) => id == cur.id)) acc.push(cur); return acc;}, [])
                    .reduce((acc, {name}) => `${acc}${name}<br>`, "")
                }}/>
              :
                <em>Loading...</em>
            }
            
            <form method="dialog">
              <button
                onClick={ () => this.setupAudioPlayers() }>
                  OK
              </button>
            </form>
          </div>
        </dialog>

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
