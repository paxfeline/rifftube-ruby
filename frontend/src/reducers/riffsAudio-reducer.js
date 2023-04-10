import {
  SET_VIDEO_ID,
  EDIT_RIFF,
  SAVE_NEW_RIFF_SUCCESS,
  SAVE_NEW_RIFF,
  SAVE_EDIT_RIFF,
  CREATE_TEMP_AUDIO_RIFF,
  CREATE_TEMP_TEXT_RIFF,
  RIFF_LOADED,
  SAVE_TEMP_AUDIO,
  CANCEL_EDIT,
  LOAD_RIFF,
} from '../actions/index.js';

let initialState = { loading: {}, all: {} };

const riffsAudioReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_NEW_RIFF_SUCCESS: {
      return {
        ...state,
        all: {
          ...state,
          [action.payload.id]: state.temp,
        },
      };
    }
    case SAVE_NEW_RIFF: {
      // adding a new riff:
      return {
        ...state,
        all: {
          ...state.saving,
          [action.payload.tempId]: true,
        },
      };
    }
    case SAVE_EDIT_RIFF: {
      // edit riff:
      return {
        ...state,
        all: {
          ...state,
          [action.riff.id]: action.payload.payload,
        },
      };
    }
    case LOAD_RIFF: 
    {
      return {
        ...state,
        // add [this riff's id]: true to state.loading object
        loading: {
          ...state.loading,
          [action.payload]: true,
        },
      };
    }
    case RIFF_LOADED:
    {
      // unpack state.loading object, delete the entry for the loaded riff's id
      const loading = {...state.loading};
      delete loading[action.id]
      // create blob for audio and add to state
      //debugger;
      const audio = new Blob(new Array(action.payload), {
            type: 'audio/mp3',
          });
      return {
        ...state,
        loading,
        all: {
          ...state.all,
          [action.id]: audio
        },
      };
    }
    default:
      return state;
  }
};

export default riffsAudioReducer;
