import { GET_PROGRAMS, RESET_STATE } from './actions';

const initialState = {
    programs: []
}

function programsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PROGRAMS:
            return { ...state, programs: action.payload };
        case RESET_STATE:
            return initialState;
        default:
            return state;
    }
}

export default programsReducer;
