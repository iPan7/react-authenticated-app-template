import { FETCH_USER} from '../actions/types';

// state being null allows the app to "think" about authentication verification before changing the state

export default function(state = null, action) {
    // console.log(action);
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false;
        default:
            return state;
    }
}