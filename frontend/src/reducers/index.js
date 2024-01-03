import { combineReducers } from 'redux';

import riffsReducer from './riffs-reducer';
import riffsAudioReducer from './riffsAudio-reducer';
import riffsMetaReducer from './riffsMeta-reducer';
import modeReducer from './mode-reducer';
import riffsPlayingReducer from './riffsPlaying-reducer';
import nameReducer from './name-reducer';
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
import loggedInReducer from './logged-in-reducer';
import confirmedReducer from './confirmed-reducer';

import metaBarPlayheadReducer from './metaBarPlayhead-reducer';
import metaBarCallbackReducer from './metaBarCallback-reducer';

import rifftubePlayerReducer from './rifftubePlayer-reducer';
import audioPlayersReducer from './audioPlayers-reducer';

// TODO: move appropriate state variables to respective components?

export default combineReducers({
  riffs: riffsReducer,
  riffsAudio: riffsAudioReducer,
  riffsMeta: riffsMetaReducer, // unused?
  mode: modeReducer,
  riffsPlaying: riffsPlayingReducer,
  name: nameReducer, // remove?
  videoID: videoIDReducer,
  duration: videoDurationReducer,
  websocket: webSocketReducer,
  userData: userDataReducer, // inc video list
  publicProfileData: publicProfileDataReducer, // move to component state; combine with publicProfileName?
  publicProfileName: publicProfileNameReducer, // move to component state; see above
  globalVideoList: globalVideoListReducer, // move to component state
  immediateRecord: immediateRecordReducer,
  recorder: recorderReducer,
  acctImgKey: acctImgKeyReducer, // move to comp. (Account)

  userInfo: userInfoReducer,
  loggedIn: loggedInReducer,
  confirmed: confirmedReducer,

  metaBarPlayhead: metaBarPlayheadReducer,
  metaBarCallback: metaBarCallbackReducer,

  rifftubePlayer: rifftubePlayerReducer,
  audioPlayers: audioPlayersReducer,


});
