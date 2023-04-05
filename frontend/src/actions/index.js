import axios from 'axios';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const CREATE_TEMP_AUDIO_RIFF = 'CREATE_TEMP_AUDIO_RIFF';
export const CREATE_TEMP_TEXT_RIFF = 'CREATE_TEMP_TEXT_RIFF';

export const EDIT_RIFF = 'EDIT_RIFF';

export const CANCEL_EDIT = 'CANCEL_EDIT';
export const SAVE_NEW_RIFF = 'SAVE_NEW_RIFF';

export const SAVE_NEW_RIFF_SUCCESS = 'SAVE_NEW_RIFF_SUCCESS';
export const SAVE_NEW_RIFF_FAILURE = 'SAVE_NEW_RIFF_FAILURE';

export const SAVE_EDIT_RIFF = 'SAVE_EDIT_RIFF';

export const SAVE_EDIT_RIFF_SUCCESS = 'SAVE_EDIT_RIFF_SUCCESS';
export const SAVE_EDIT_RIFF_FAILURE = 'SAVE_EDIT_RIFF_FAILURE';

export const UPDATE_RIFF_TIME_SUCCESS = 'UPDATE_RIFF_TIME_SUCCESS';

export const DELETE_RIFF = 'DELETE_RIFF';

export const SAVE_TEMP_AUDIO = 'SAVE_TEMP_AUDIO';

export const SET_RIFF_PLAYING = 'SET_RIFF_PLAYING';
export const SET_RIFF_NOT_PLAYING = 'SET_RIFF_NOT_PLAYING';

export const LOAD_RIFF = 'LOAD_RIFF';
export const RIFF_LOADED = 'RIFF_LOADED';

export const SET_PLAYER_MODE = 'SET_PLAYER_MODE';
export const EDIT_MODE = 'EDIT_MODE';
export const EDIT_NEW_MODE = 'EDIT_NEW_MODE';
export const PLAY_MODE = 'PLAY_MODE';
export const PAUSE_MODE = 'PAUSE_MODE';
export const TOGGLE_PLAYER_MODE = 'TOGGLE_PLAYER_MODE';

export const SET_VIDEO_ID = 'SET_VIDEO_ID';
export const RECEIVE_NAME_UPDATE = 'RECEIVE_NAME_UPDATE';

export const RECEIVE_RIFF_LIST = 'RECEIVE_RIFF_LIST';
export const RECEIVE_RIFF_META = 'RECEIVE_RIFF_META';

export const TOGGLE_VIEW_USERID_MUTED = 'TOGGLE_VIEW_USERID_MUTED';
export const SET_VIEW_USERID_MUTED = 'SET_VIEW_USERID_MUTED';

export const RECEIVE_COLLABORATION_ID = 'RECEIVE_COLLABORATION_ID';
export const CREATE_PLAYLIST_SUCCESS = 'START_COLLABORATION_SUCCESS';
export const CREATE_PLAYLIST_FAILURE = 'START_COLLABORATION_FAILURE';

export const SET_VIDEO_DURATION = 'SET_VIDEO_DURATION';

export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const LOAD_PUBLIC_USER_DATA = 'LOAD_PUBLIC_USER_DATA';
export const LOAD_PUBLIC_USER_NAME = 'LOAD_PUBLIC_USER_NAME';
export const LOAD_GLOBAL_VIDEO_LIST = 'LOAD_GLOBAL_VIDEO_LIST';

export const SET_IMMEDIATE_OFF = 'SET_IMMEDIATE_OFF';
export const SET_IMMEDIATE_ON = 'SET_IMMEDIATE_ON';

export const SET_RECORDER = 'SET_RECORDER';

export const WEB_SOCKET_UPDATE = 'WEB_SOCKET_UPDATE';

export const SAVE_PIC_SUCCESS = 'SAVE_PIC_SUCCESS';
export const SAVE_PIC_FAILURE = 'SAVE_PIC_FAILURE';

export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

/******** Login and logout */

export const login = (email, password) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: `/login`,
      data: { email, password },
    }).then((res) => {
      //debugger;
      dispatch({ type: LOGIN, payload: res.data });
    }).catch(err =>
      console.log("error", err));
  };
};

export const loginWithGoogle = (credentialResponse) => {
  console.log(credentialResponse);
  //debugger;
  return (dispatch) => {
    axios({
      method: 'post',
      url: `/login-with-google`,
      data: { credentials: credentialResponse },
    }).then((res) => {
      console.log(res);
      dispatch({ type: LOGIN, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const logout = () => {
  return (dispatch) => {
    axios({
      method: 'delete',
      url: `/logout`,
    }).then((res) => {
      //debugger;
      dispatch({ type: LOGOUT, payload: res.data });
    }).catch(err =>
      console.log("error", err));
  };
};

export const currentUserStatus = () => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/user-status`,
    }).then((res) => {
      //debugger;
      dispatch({ type: LOGIN, payload: res.data });
    }).catch(err =>
      console.log("error", err));
  };
};


/********** Saving, editing  */


export const saveEditRiff = (detail) =>
{
  let detailObj = Object.fromEntries(detail.entries());
  return (dispatch) =>
  {
    dispatch({ type: SAVE_EDIT_RIFF, payload: detailObj });
    fetch(`/riffs/${detail.id}`,
      {
        method: 'PATCH',
        body: detail
      })
      .then(response => response.json())
      .then(response => dispatch({ type: SAVE_EDIT_RIFF_SUCCESS, payload: response.data }))
      .catch(err => dispatch({ type: SAVE_EDIT_RIFF_FAILURE, payload: err }));
  }
}

export const saveNewRiff = (detail) =>
{
  // add tempId
  debugger;
  detail.set("tempId", new Date().getUTCMilliseconds());
  let detailObj = Object.fromEntries(detail.entries());
  const numericFields = ["riff[start]", "riff[duration]"];
  numericFields.forEach(el => detailObj[el] = Number(detailObj[el]));
  return (dispatch) =>
  {
    dispatch({ type: SAVE_NEW_RIFF, payload: detailObj });
    fetch(`/riffs`, 
      {
        method: 'POST',
        body: detail
      })
      .then(response => response.json())
      .then(response => dispatch({ type: SAVE_NEW_RIFF_SUCCESS, payload: response.data }))
      .catch(err => dispatch({ type: SAVE_NEW_RIFF_FAILURE, payload: err }));
  }
}


/******** WebSockets */

export const setWebSocket = (payload) => ({
  type: WEB_SOCKET_UPDATE,
  payload,
});

/******** Editing Interface */

export const setVideoDuration = (payload) => ({
  type: SET_VIDEO_DURATION,
  payload,
});

export const setRifferName = (newName) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: `/set-name`,
      data: { newName },
    }).then((res) => {
      dispatch({ type: RECEIVE_NAME_UPDATE, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const setRiffPic = (payload) => {
  return (dispatch) => {
    let fd = new FormData();
    fd.append('image', payload);
    axios({
      method: 'post',
      url: `/save-pic`,
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        // res.data.data
        dispatch({ type: SAVE_PIC_SUCCESS, payload: res.data }); // fix these to constants
      })
      .catch((err) => {
        dispatch({ type: SAVE_PIC_FAILURE, payload: err.response });
      });
  };
};

// updated to use get
export const getRiffs = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}&user_id=self`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_LIST, payload: res.data });
    }).catch(err => console.log("error", err));

    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_META, payload: res.data });
    }).catch(err => console.log("error", err));
  }
};

export const setVideoID = (videoID) => {
  return (dispatch) => {
    dispatch({
      type: SET_VIDEO_ID,
      payload: videoID,
    });
    
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_META, payload: res.data });
    }).catch(error => {
      dispatch({ type: RECEIVE_RIFF_META, payload: [] });
    });
  
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}&user_id=self`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_LIST, payload: res.data });
    }).catch(error => {
      console.error(error);
      dispatch({ type: RECEIVE_RIFF_LIST, payload: [] });
    });
    
  };
};

//Delete Riff
export const deleteRiff = (riffID, video_id, websocket) => {
  return (dispatch) => {
    axios({
      method: 'delete',
      url: `/riff-remove/${riffID}`
    }).then((res) => {
      dispatch({ type: DELETE_RIFF, id: riffID });

      // websocket call
      websocket.send(JSON.stringify({ type: 'update', video_id }));
    }).catch(err => console.log("error", err));
  };
};

// perhaps this action should somehow call the above action (setVideoID)?


export const getRiffsMeta = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/get-view-riffs/${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_META, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const getViewRiffs = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_LIST, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const getUserData = () => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: '/get-user-data',
    }).then((res) => {
      dispatch({ type: LOAD_USER_DATA, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const getPublicUserData = (id) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/get-user-data-by-id/${id}`,
    }).then((res) => {
      dispatch({ type: LOAD_PUBLIC_USER_DATA, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const getGlobalVideoList = () => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: '/videos?host=www.youtube.com',
    }).then((res) => {
      dispatch({ type: LOAD_GLOBAL_VIDEO_LIST, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const setPlayerMode = (mode) => ({
  type: SET_PLAYER_MODE,
  payload: mode,
});

export const togglePlayerMode = (mode) => ({
  type: TOGGLE_PLAYER_MODE,
});

/*export const saveRiff = payload => ({
  type: SAVE_NEW_RIFF,
  payload
});*/

export const saveTempAudio = (payload, duration) => ({
  type: SAVE_TEMP_AUDIO,
  payload,
  duration,
});

export const editRiff = (payload, id, load) => {
  return (dispatch) => {
    dispatch({
      type: EDIT_RIFF,
      payload, // index
      id,
    });

    // id is only passed when the audio riff needs loading
    if (load) rawLoadAxios(dispatch, id); // loads riff audio
  };
};

export const cancelEdit = () => ({
  type: CANCEL_EDIT,
});

export const updateRiffTime = (token, start, video_id, riff_id, websocket) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: `/update-riff-start`,
      data: { token, start, id: riff_id },
    })
      .then((res) => {
        // res.data.data
        dispatch({ type: UPDATE_RIFF_TIME_SUCCESS, id: riff_id, start: start });
        // websocket call
        websocket.send(
          JSON.stringify({ type: 'update', video_id: video_id })
        );
      })
      .catch((err) => {
        dispatch({ type: SAVE_NEW_RIFF_FAILURE, payload: err.response });
      });

    // dispatch NOTHING
  };
}

export const createTempRiff = (type, videoID, immediateRecord = false) => ({
  type: type === 'audio' ? CREATE_TEMP_AUDIO_RIFF : CREATE_TEMP_TEXT_RIFF,
  videoID,
  immediateRecord,
});

export const setImmediateOn = () => ({
  type: SET_IMMEDIATE_ON,
});

export const setImmediateOff = () => ({
  type: SET_IMMEDIATE_OFF,
});

export const setRecorder = (payload) => ({
  type: SET_RECORDER,
  payload,
});

export const setRiffPlaying = (index, playing) => ({
  type: playing ? SET_RIFF_PLAYING : SET_RIFF_NOT_PLAYING,
  payload: index,
});

export const loadRiff = id => {
  return (dispatch) => {
    dispatch({ type: LOAD_RIFF, payload: id });
    rawLoadAxios(dispatch, id);
  };
};

const rawLoadAxios = (dispatch, id) => {
  axios({
    method: 'get',
    url: `/riffs/${id}`,
    responseType: 'arraybuffer',
  }).then((res) => {
    dispatch({ type: RIFF_LOADED, payload: res.data, id });
  }).catch(err => console.log("error", err));
};
