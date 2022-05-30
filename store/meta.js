import {GET_PROGRAMS_META, GET_APPEALS_META, GET_SERVICES_META, RESET_STATE} from './actions';

const initialState = {
    programs: {},
    services: {},
    appeals: {}
}

function metaReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PROGRAMS_META:
            return { ...state, programs: action.payload };
        case GET_APPEALS_META:
            return { ...state, appeals: action.payload };
        case GET_SERVICES_META:
            return { ...state, services: action.payload };
        case RESET_STATE:
            return initialState;
        default:
            return state;
    }
}

export default metaReducer;
