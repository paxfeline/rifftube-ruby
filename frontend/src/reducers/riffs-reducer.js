import {
  DELETE_RIFF,
  SAVE_NEW_RIFF,
  SAVE_EDIT_RIFF,
  RECEIVE_RIFF_LIST,
  SAVE_NEW_RIFF_SUCCESS,
  SAVE_EDIT_RIFF_SUCCESS,
  UPDATE_RIFF_TIME_SUCCESS,
} from '../actions/index.js';

let initialState = [];

const riffsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_RIFF:
    {
      let ret = { ...state };
      delete ret[action.id]
      return ret;
    }
    case RECEIVE_RIFF_LIST:
      return action.payload.reduce(
        (acc, cur) =>
        {
          cur.payload = cur.isText ? cur.text : null;
          cur.type = cur.isText ? 'text' : 'audio';
          acc[cur.id] = cur;
          return acc;
        },
        {}
      );
    case UPDATE_RIFF_TIME_SUCCESS:
    {
      let ret = { ...state };
      ret[action.id].start = Number(action.start);
      return ret;
    }
    case SAVE_NEW_RIFF: // code block for variable grouping
    {
      const riff = action.payload;
      delete riff.payload;

      // create new riffs list, including new riff
      return (
        {
          ...state,
          [riff.tempId]: riff
        });
    }
    case SAVE_EDIT_RIFF:
    {
      const riff = action.payload;
      delete riff.payload;

      let riffs = { ...state };
      riffs[riff.id] = riff;

      return riffs;
    }

    case SAVE_NEW_RIFF_SUCCESS:
    {
      let id = action.payload.id;
      let tempId = action.payload.tempId;
      let riffs = { ...state };
      riffs[id] = { ...riffs[tempId], id };
      delete riffs[id].unsaved;
      delete riffs[tempId];
      return riffs;
    }
    case SAVE_EDIT_RIFF_SUCCESS:
    {
      let id = action.payload;
      let riffs = { ...state };
      riffs[id] = { ...riffs[id] };
      delete riffs[id].unsaved;
      return riffs;
    }

    default:
      return state;
  }
};

export default riffsReducer;
