import { LOGIN } from '../actions/index.js';

const userInfoReducer = (state = null, action) => {
    switch (action.type) {
        case LOGIN:
            return action.payload.userInfo
        default:
            return state;
        }
    };

export default userInfoReducer;
