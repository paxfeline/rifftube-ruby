import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import RiffList from './RiffList.js';
import RiffButton from './RiffButton.js';
import { setRifferName } from '../../actions'; // this and below are the same file

import { createTempRiff, togglePlayerMode, setRecorder } from '../../actions/index.js';

function executeScriptElements(containerElement)
{
  //debugger;
  
  console.log("reworking scripts");

  const scriptElements = containerElement.querySelectorAll("script");

  Array.from(scriptElements).forEach((scriptElement) => {
    const clonedElement = document.createElement("script");

    Array.from(scriptElement.attributes).forEach((attribute) => {
      clonedElement.setAttribute(attribute.name, attribute.value);
    });
    
    clonedElement.text = scriptElement.text;

    console.log("rework: ", clonedElement);

    scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
  });
}

/*This component houses all of the riff buttons and the rifflist*/
function EditControls(props)
{
  const [dial, setDial] = useState(null);

  let templateRef = React.useRef(null);


  function startNewRiff(immediateRecord)
  {
    let td = templateRef.current.content.firstChild.cloneNode(true);
    if (immediateRecord)
      td.setAttribute("data-immediate-record", "true");
    document.body.append(td);
    //td.showModal();
    console.log('set dial', td);
    setDial(td);
  }

  function keydown(e)
  {

    if ( e.getModifierState("Control") +
            e.getModifierState("Alt") +
            e.getModifierState("Meta") > 1 )
        return;

    console.log('kd', dial)
    if (!dial && e.key == 'r')
    {
      startNewRiff(true);
      e.stopPropagation();
    }
  }

  function closeDial()
  {
    setDial(null);
  }

  function saveRiff({ detail })
  {
    console.log( detail );
  }
  
  useEffect(() =>
  {
        document.addEventListener('rifftube:riff:save', saveRiff, false);
        document.addEventListener('rifftube:riff:save:close', closeDial, false);
        document.addEventListener('keydown', keydown, false);

        return () =>
        {
          document.removeEventListener('rifftube:riff:save', saveRiff, false);
          document.removeEventListener('rifftube:riff:save:close', closeDial, false);
          document.removeEventListener('keydown', keydown, false);
        }
  }, [dial]);
  
  useEffect(() =>
  {
    fetch(`/riffs/new?video_id=${props.videoID}`)
      .then(response => response.text())
      .then(text =>
        {
          let el = templateRef.current;
          el.innerHTML = text;
          executeScriptElements(el.content);
        });
  }, [props.videoID]);


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

  return (
    <div className="control-panel">
      {
        // make this into a component?:
        props.name ? (
          <React.Fragment>
            <div className="riffer-name">
              Riffer Name:&nbsp;
              {props.name}
            </div>
          </React.Fragment>
        ) : null
      }

      {/* to add back later <Collaboration /> */}

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
      <h2 className="riff-list-title">Control Panel</h2>
      <RiffList />
      <template ref={templateRef}></template>
    </div>
  );
}

let mapStateToProps = (state) => ({
  mode: state.mode,
  name: state.name,
  videoID: state.videoID,
  duration: state.duration,
  recorder: state.recorder,
});

const mapDispatchToProps = {
  setRifferName,
  createTempRiff,
  togglePlayerMode,
  setRecorder,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditControls);
