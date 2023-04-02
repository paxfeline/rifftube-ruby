import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RiffList from './RiffList.js';
import RiffButton from './RiffButton.js';
import Login from '../Login/Login';

import { setRifferName, createTempRiff, togglePlayerMode, setRecorder } from '../../actions/index.js';

import { executeScriptElements } from './util.js';

/*This component houses all of the riff buttons and the rifflist*/
function EditControls(props)
{
  let templateRef = React.useRef(null);

  function startNewRiff(immediateRecord)
  {
    let td = templateRef.current.content.firstChild.cloneNode(true);
    if (immediateRecord)
      td.setAttribute("data-immediate-record", "true");
    document.body.append(td);
  }

  function keydown(e)
  {
    console.log('kd meta count', e.getModifierState("Control") +
      e.getModifierState("Alt") +
      e.getModifierState("Meta"));

    if ( e.getModifierState("Control") +
            e.getModifierState("Alt") +
            e.getModifierState("Meta") > 0 )
        return;

    if (e.key == 'r')
    {
      startNewRiff(true);
      //e.stopPropagation();
    }
  }

  function saveRiff({ detail })
  {
    console.log( detail );
  }
  
  useEffect(() =>
  {
        document.addEventListener('rifftube:riff:save', saveRiff, false);
        document.addEventListener('keydown', keydown, false);

        return () =>
        {
          document.removeEventListener('rifftube:riff:save', saveRiff, false);
          document.removeEventListener('keydown', keydown, false);
        }
  }, []);
  
  useEffect(() =>
  {
    if (props.loggedIn)
    {
      fetch(`/riffs/new?video_id=${props.videoID}`)
        .then(response => response.text())
        .then(text =>
          {
            let el = templateRef.current;
            el.innerHTML = text;
            executeScriptElements(el.content);
          });
    }
  }, [props.videoID, props.loggedIn]);


    /*
    const blurEvent = () =>
    {
      setTimeout(() => {
        document.activeElement.blur();
      }, 100);
    };
    window.addEventListener('blur', blurEvent);
    const keydownEvent = (e) => {
      console.log(props.mode);

      if (e.key === 'r') props.createTempRiff('audio', props.videoID, true);
      else if (e.key === 't') props.createTempRiff('text', props.videoID);
      else if (props.mode === EDIT_MODE || props.mode === EDIT_NEW_MODE) return;
      else if (e.key === 'j' || e.key === 'ArrowLeft' || e.key === 'Left')
        // I actually took MS specific BS into account
        window.rifftubePlayer.seekTo(
          Math.max(window.rifftubePlayer.getCurrentTime() - 5, 0),
          true
        );
      else if (e.key === 'l' || e.key === 'ArrowRight' || e.key === 'Right')
        window.rifftubePlayer.seekTo(
          Math.min(window.rifftubePlayer.getCurrentTime() + 5, props.duration),
          true
        );
      else if (e.key === ' ' || e.key === 'k') {
        props.togglePlayerMode();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keydownEvent);

    return () => {
      window.removeEventListener('blur', blurEvent);
      window.removeEventListener('keydown', keydownEvent);
    };
  }, [props]);
  */

  console.log("ec props", props);

  return (
        <div className="control-panel">
          {
            props.loggedIn ?
            (
              <React.Fragment>
                {
                  props.userInfo?.name ?
                  (
                    <div className="riffer-name">
                      Riffer Name:&nbsp;
                      {props.userInfo.name}
                    </div>
                  ) : null

                  /* to add back later <Collaboration /> */
                }
                <div>
                  <h2 className="add-riff-title">Add New Riff</h2>
                  {
                    props.recorder !== null ?
                      <RiffButton type="audio" />
                    :
                      <button onClick={() => {
                        var AudioContext =
                          window.AudioContext || window.webkitAudioContext; // Default // Safari and old versions of Chrome
                        var audioContext = new AudioContext();
                        if (navigator.mediaDevices) {
                          navigator.mediaDevices
                            .getUserMedia({ audio: true, video: false })
                            .then((stream) => {
                              // gum (get user media)
                              var input = audioContext.createMediaStreamSource(stream);
                          
                              var recorder = new window.WebAudioRecorder(input, {
                                workerDir: '/lib/',
                                encoding: 'mp3',
                                onEncoderLoading: (recorder, encoding) => {
                                  // show "loading encoder..." display
                                  console.log('Loading ' + encoding + ' encoder...');
                                },
                                onEncoderLoaded: (recorder, encoding) => {
                                  // hide "loading encoder..." display
                                  console.log(encoding + ' encoder loaded');
                                },
                              });
                              props.setRecorder(recorder);
                            })
                            .catch(function (err) {
                              //enable the record button if getUSerMedia() fails
                              console.log("oops, can't get stream", err);
                            });
                        }
                      }}>
                        Click to allow recording
                      </button>
                  }
                  <RiffButton type="text" />

                </div>
                <RiffList />
                <template ref={templateRef}></template>
              </React.Fragment>
            ) : 
              <div>
                <h2 className="add-riff-title">Sign In</h2>
                <Login /> <p>to get started</p>
              </div>
          }
        </div>
  );
}

let mapStateToProps = (state) => ({
  mode: state.mode,
  userInfo: state.userInfo,
  videoID: state.videoID,
  duration: state.duration,
  recorder: state.recorder,
  loggedIn: state.loggedIn,
});

const mapDispatchToProps = {
  setRifferName,
  createTempRiff,
  togglePlayerMode,
  setRecorder,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditControls);
