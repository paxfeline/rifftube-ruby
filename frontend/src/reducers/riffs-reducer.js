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
      // create object from modified entries
      const riff = Object.fromEntries(
        [
          ...action.payload.entries
            // convert keys from riff[*] to *
            .map(
              el =>
              (
                [
                  el[0].match(/riff\[(\w+)\]/)[1],
                  el[1]
                ]
              )
            ),
          ["saved", false],
          ["tempId", new Date().getUTCMilliseconds()]
        ]
      );

        //...action.payload,
      delete riff.payload;

      // create new riffs list, including new riff
      return (
      {
        ...state,
        [`temp-${riff.tempId}`]: riff
      });
    }
    case SAVE_EDIT_RIFF:
    {
      const riff = { ...action.payload, saved: false };
      delete riff.payload;

      let riffs = [...state];
      riffs[riff.id] = riff;

      return riffs;
    }

    case SAVE_NEW_RIFF_SUCCESS:
    {
      let riffs = [...state];
      riffs.forEach((el, ind, arr) => {
        if (el.tempId === action.payload.tempId)
          arr[ind] = { ...el, id: action.payload.id };
        //el.id = action.payload.id;
      });
      return riffs;
    }
    case SAVE_EDIT_RIFF_SUCCESS:
    {
      
    }

    default:
      return state;
  }
};

export default riffsReducer;
