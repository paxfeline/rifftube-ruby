import { combineReducers } from 'redux';

import riffsReducer from './riffs-reducer';
import riffsAudioReducer from './riffsAudio-reducer';
import riffsMetaReducer from './riffsMeta-reducer';
import modeReducer from './mode-reducer';
import googleUserReducer from './googleUser-reducer';
import riffsPlayingReducer from './riffsPlaying-reducer';
import nameReducer from './name-reducer';
import useridReducer from './userid-reducer';
import videoIDReducer from './videoID-reducer';
import videoDurationReducer from './videoDuration-reducer';
import webSocketReducer from './websocket-reducer';
import userDataReducer from './userData-reducer';
import publicProfileDataReducer from './publicProfileData-reducer';
import publicProfileNameReducer from './publicProfileName-reducer';
import globalVideoListReducer from './globalVideoList-reducer';
import immediateRecordReducer from './immediate-record-reducer';
import recorderReducer from './recorder-reducer';
import acctImgKeyReducer from './acctImgKey-reducer';

import userInfoReducer from './user-info-reducer';

// TODO: move appropriate state variables to respective components?

export default combineReducers({
  riffs: riffsReducer,
  riffsAudio: riffsAudioReducer,
  riffsMeta: riffsMetaReducer,
  mode: modeReducer,
  googleUser: googleUserReducer,
  riffsPlaying: riffsPlayingReducer,
  name: nameReducer, // remove?
  user_id: useridReducer, // remove
  videoID: videoIDReducer,
  duration: videoDurationReducer,
  websocket: webSocketReducer,
  userData: userDataReducer, // inc video list
  publicProfileData: publicProfileDataReducer, // combine with publicProfileName?
  publicProfileName: publicProfileNameReducer, // see above
  globalVideoList: globalVideoListReducer,
  immediateRecord: immediateRecordReducer,
  recorder: recorderReducer,
  acctImgKey: acctImgKeyReducer,

  userInfo: userInfoReducer,
});
