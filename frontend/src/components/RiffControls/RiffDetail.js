import React, { useState, useEffect, createRef } from 'react';
import { connect } from 'react-redux';
import { editRiff, deleteRiff, updateRiffTime } from '../../actions/index.js';
import Audio from '../../images/settings_voice-24px.svg';
import Text from '../../images/chat-24px.svg';

import { executeScriptElements } from './util.js';

/*
import Delete from '../../images/delete-24px.svg';
import Edit from '../../images/edit-24px.svg';
*/

/* this component is where a user can edit their riff */
function RiffDetail(props) {
  const [visible, setVisible] = useState(false);

  //useEffect(() => { setTimeout(() => {setVisible(true);}, 20000); }, []);
  useEffect(() => {
    setVisible(true);
  }, []);

  const divRef = createRef();

  useEffect(() => {
    if (props.scroll)
      divRef.current.parentNode.scrollTop = divRef.current.offsetTop;
  }, [divRef, props.scroll]);

  const timeRef = createRef();

  console.log(props);

  return (
    <div
      ref={divRef}
      className={`riff-detail${props.selected ? ' riff-detail-selected' : ''}${
        visible ? '' : ' invisible'
      }`}
      style={props.style}
    >
      <button
        onClick={() => {
          props.rifftubePlayer?.seekTo(Math.max(props.start - 3, 0), true);
        }}
      >
        ⇥
      </button>
      {props.type === 'audio' ? (
        <div className="audio-icon riff-type-icon">
          <img alt="audio" src={Audio} />
        </div>
      ) : (
        <div className="text-icon riff-type-icon">
          <img alt="text" src={Text} />
        </div>
      )}
      {/* 
      <li>
        start start: {props.start ? props.start.toFixed(2) : null}
      </li>
      <li>duration: {props.duration.toFixed(2)}secs</li>
      <li>type: {props.type}</li>
      */}
      <input
        type="number"
        className="edit-start"
        step="0.5"
        defaultValue={props.start.toFixed(2)}
        ref={timeRef}
        onChange={() => {
          props.updateRiffTime(
            timeRef.current.value,
            props.video_id,
            props.id,
            props.websocket
          );
        }}
      ></input>
      <div className="edit-riff-buttons">
        <button
          className="riff-button"
          onClick={() =>
            {
              fetch(`/riffs/${props.id}/edit`)
                .then(response => response.text())
                .then(text =>
                  {
                    let el = document.createElement("div");
                    el.innerHTML = text;
                    executeScriptElements(el);
                    document.body.append(el.firstChild);
                  });
            }
            /*
            props.editRiff(
              props.index,
              props.type === 'audio' ? props.id : null, // weird but ok; yields id or null/false
              !props.riffsAudio[props.id]
            )
            */
          }
        >
          ✎
        </button>
        <button
          className="riff-button"
          onClick={() => {
            if (window.confirm('Delete?'))
              props.deleteRiff(
                props.id,
                props.video_id,
                props.websocket
              );
          }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  riffsAudio: state.riffsAudio.all,
  rifftubePlayer: state.rifftubePlayer,
});

const mapDispatchToProps = {
  editRiff,
  deleteRiff,
  updateRiffTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(RiffDetail);
