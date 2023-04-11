import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import RiffList from './RiffList.js';
import Login from '../Login/Login';

import { setRifferName, togglePlayerMode, setRecorder,
  saveNewRiff, saveEditRiff } from '../../actions/index.js';

import { executeScriptElements } from './util.js';

/*This component houses all of the riff buttons and the rifflist*/
function EditControls(props)
{
  let templateRef = React.useRef(null);

  useEffect( () =>
  {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        let mediaRecorder = new MediaRecorder(stream);
        props.setRecorder(mediaRecorder);
      });
  }, []);

  let keydown = useCallback( (e) =>
    {
      let startNewRiff = (immediateRecord) =>
      {
        let td = templateRef.current.content.firstChild.cloneNode(true);
        if (immediateRecord == 'r')
          td.setAttribute("data-immediate-record", "true");
        if (immediateRecord == 't')
          td.setAttribute("data-immediate-text", "true");
        document.body.append(td);

        let cust_event = new CustomEvent("rifftube:riff:edit:setup", { detail: { recorder: props.recorder } });
        td.dispatchEvent(cust_event);
        console.log('dispatched', cust_event);
      }

      if (document.querySelector('.rifftube-riff-edit-dialog')) return;
      
      console.log('kd meta count', e.getModifierState("Control") +
        e.getModifierState("Alt") +
        e.getModifierState("Meta"));

      if ( e.getModifierState("Control") +
              e.getModifierState("Alt") +
              e.getModifierState("Meta") > 0 )
          return;

      if (e.key == 'r' || e.key == 't')
      {
        // immediate record if pressing r but not t
        startNewRiff(e.key);
      }
    },
    [props.recorder] );

  function saveRiff({ detail })
  {
    // detail is FormData

    console.log( "sr", detail );
    
    if ( detail.id )
    {
      props.saveEditRiff(detail);
    }
    else
    {
      props.saveNewRiff(detail);
    }
  }
  
  useEffect(() =>
  {
    document.addEventListener('rifftube:riff:save', saveRiff, false);

    return () =>
    {
      document.removeEventListener('rifftube:riff:save', saveRiff, false);
    }
  }, []);

  useEffect(() =>
  {
    document.addEventListener('keydown', keydown, false);

    return () =>
    {
      document.removeEventListener('keydown', keydown, false);
    }
  }, [keydown]);
  
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
  togglePlayerMode,
  setRecorder,
  saveNewRiff,
  saveEditRiff,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditControls);
