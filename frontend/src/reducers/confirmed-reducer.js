import { LOGIN, LOGOUT } from '../actions/index.js';

const confirmedReducer = (state = false, action) => {
    switch (action.type) {
        case LOGIN:
            return action.payload.confirmed;
        case LOGOUT:
            return false;
        default:
            return state;
        }
    };

export default confirmedReducer;
