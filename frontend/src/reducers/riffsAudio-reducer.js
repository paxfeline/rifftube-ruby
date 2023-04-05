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

let initialState = { saving: {}, loading: {}, temp: null, all: {}, editIndex: null };

const riffsAudioReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TEMP_AUDIO_RIFF:
    case CREATE_TEMP_TEXT_RIFF:
      return { ...state, editIndex: null };
    case SET_VIDEO_ID:
      return initialState;
    case EDIT_RIFF:
      return {
        ...state,
        temp: state[action.id], // copy specified riff audio to temp
        editIndex: action.payload
      };
    case SAVE_NEW_RIFF_SUCCESS: {
      if (action.payload.type === 'add') {
        const { [action.payload.tempId]: foo, ...saving } = state.saving; // foo is discarded
        return {
          ...state,
          saving,
          all: {
            ...state,
            [action.payload.id]: state.temp,
          },
          temp: null,
        };
      } else return state;
    }
    case SAVE_NEW_RIFF: {
      // adding a new riff:
      return {
        ...state,
        saving: {
          ...state.saving,
          [action.riff.tempId]: true,
        },
        editIndex: null,
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
        editIndex: null,
        temp: null,
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
      // unpack state.loading object, selecting (and discarding) the entry for the loaded riff's id (foo)
      // the new loading var holds the loading object minus the loaded riff
      const { [action.id]: foo, ...loading } = state.loading;
      // create blob for audio and add to state
      //debugger;
      const audio = new Blob(new Array(action.payload), {
            type: 'audio/mp3',
          });
      return {
        ...state,
        loading,
        all: {
          ...state,
          [action.id]: audio
        },
        temp: state.editIndex === null ? null : audio,
      };
    }
    case SAVE_TEMP_AUDIO:
      return {
        ...state,
        temp: action.payload,
      };
    case CANCEL_EDIT:
      return {
        ...state,
        temp: null,
        editIndex: null,
      };
    default:
      return state;
  }
};

export default riffsAudioReducer;
