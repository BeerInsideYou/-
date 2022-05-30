import {GET_APPEALS, ADD_APPEAL, RESET_STATE} from './actions';

const initialState = {
    appeals: []
}

function appealsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPEALS:
            return { ...state, appeals: action.payload };
        case ADD_APPEAL:
            return { ...state, appeals: state.appeals.unshift(action.payload)}
        case RESET_STATE:
            return initialState;
        default:
            return state;
    }
}

export default appealsReducer;
