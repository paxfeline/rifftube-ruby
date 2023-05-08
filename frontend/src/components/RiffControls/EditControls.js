import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import RiffList from './RiffList.js';
import Login from '../Login/Login';

import { setRifferName, togglePlayerMode, setRecorder,
  saveNewRiff, saveEditRiff, setVideoID } from '../../actions/index.js';

import { executeScriptElements, extractVideoID, baseURL2 } from './util.js';

/*This component houses all of the riff buttons and the rifflist*/
function EditControls(props)
{
  let templateRef = React.useRef(null);

  // enforce focus on body
  useEffect( () =>
  {
    const body = document.body;
    body.setAttribute("tabIndex", 1);
    function resetFocus()
    {
      // allow focus to leave the body if not logged in
      if (!props.loggedIn) return;

      // allow focus to leave the body if editing dialog is open
      if (document.querySelector('.rifftube-riff-edit-dialog')) return;


      // I hate this use of timeout so. much.
      // but it seems necessary
      setTimeout( () =>
      {
        body.focus();
        console.log("reset focus", document.activeElement);
        // this seems to be unnecessary, but who knows!?
        if (document.activeElement !== body)
          setTimeout(resetFocus, 10);
      }, 10 );
    }
    body.addEventListener("blur", resetFocus);

    return ( () => body.removeEventListener("blur", resetFocus) );
  }, [])

  // get user permission to record and save mediaRecorder object
  useEffect( () =>
  {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        let mediaRecorder = new MediaRecorder(stream);
        props.setRecorder(mediaRecorder);
      });
  }, []);

  // useCallback because the values of recorder and rifftubePlayer can change
  let keydown = useCallback( (e) =>
    {
      // ignore if not logged in
      if (!props.loggedIn) return;

      // ignore if the edit dialog is open
      if (document.querySelector('.rifftube-riff-edit-dialog')) return;

      let startNewRiff = (immediateRecord) =>
      {
        let td = templateRef.current.content.firstChild.cloneNode(true);
        document.body.append(td);
        td.showModal();

        let et = td.firstChild;

        // set up recorder and start time
        let set_recorder_event = new CustomEvent("rifftube:riff:edit:setup:recorder",
        {
          detail: { recorder: props.recorder }
        });
        et.dispatchEvent(set_recorder_event);

        let set_start_event = new CustomEvent("rifftube:riff:edit:setup:start",
        {
          detail: { start: props.rifftubePlayer?.getCurrentTime() }
        });
        et.dispatchEvent(set_start_event);

        let immediate_start_event = new CustomEvent("rifftube:riff:edit:start",
        {
          detail: { type: immediateRecord }
        });
        et.dispatchEvent(immediate_start_event);

        //console.log('dispatched', set_recorder_event, set_start_event);
      }
      
      console.log('kd meta count', e.getModifierState("Control") ||
        e.getModifierState("Alt") ||
        e.getModifierState("Meta"));

      if ( e.getModifierState("Control") ||
              e.getModifierState("Alt") ||
              e.getModifierState("Meta") )
          return;

      if (e.key == 'r' || e.key == 't')
      {
        // immediate record if pressing r but not t
        startNewRiff(e.key);
      }
    },
    [props.recorder, props.rifftubePlayer, props.loggedIn] );

  function saveRiff({ detail })
  {
    // detail is FormData
    console.log( "sr", detail );

    debugger;

    // get FormData entries
    const ents = Array.from(detail.entries())
      .map(
        ([key, val]) =>
        (
          [
            // convert keys from e.g. 'riff[start]' to 'start'
            // leave other keys unchanged
            key.match(/riff\[(\w+)\]/)?.[1] ?? key,
            val
          ]
        )
      );

    // create object from entries
    // mark as unsaved
    const riff = Object.fromEntries(ents);
    riff.unsaved = true;

    // properly cast numeric fields
    const numericFields = ["start", "duration"];
    numericFields.forEach(el => riff[el] = Number(riff[el]));

      //...action.payload,
    //delete riff.payload;
    
    if ( riff.id )
    {
      props.saveEditRiff(detail, riff);
    }
    else
    {
      props.saveNewRiff(detail, riff);
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
      /*
      let newRiffDialog = document.createElement("dialog");
      templateRef.current.content.append(newRiffDialog);
      let newRiffFrame = document.createElement("iframe");
      newRiffFrame.setAttribute("allow", "microphone");
      newRiffDialog.append(newRiffFrame);
      newRiffFrame.src = `${baseURL2}/riffs/new?video_id=${props.videoID}`;
      */
      
      fetch(`/riffs/new?video_id=${props.videoID}`)
        .then(response => response.text())
        .then(text =>
          {
            let dial = document.createElement("dialog");
            dial.innerHTML = text;
            let el = templateRef.current;
            el.content.append(dial);
            executeScriptElements(dial);
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
          <button className="btn" id="change-video-btn" onClick={(e) => {
              const vPrompt = prompt("Paste YouTube URL or video ID:");
              if ( vPrompt )
              {
                const vID = extractVideoID(vPrompt);
                props.history.push(`/riff/${vID}`);
                props.setVideoID(vID);
              }
            }}>
            Change Video
          </button>
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
  rifftubePlayer: state.rifftubePlayer,
});

const mapDispatchToProps = {
  setRifferName,
  togglePlayerMode,
  setRecorder,
  saveNewRiff,
  saveEditRiff,
  setVideoID,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditControls);
