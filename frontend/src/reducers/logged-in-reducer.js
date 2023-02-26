import { LOGIN, LOGOUT } from '../actions/index.js';

const loggedInReducer = (state = null, action) => {
    switch (action.type) {
        case LOGIN:
            return true
        case LOGOUT:
            return false
        default:
            return state;
        }
    };

export default loggedInReducer;
