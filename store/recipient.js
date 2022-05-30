import {GET_RECIPIENT, RESET_STATE} from './actions';

const initialState = {
  recipient: {},
}

function recipientReducer(state = initialState, action) {
  switch (action.type) {
    case GET_RECIPIENT:
      return { ...state, recipient: action.payload };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}

export default recipientReducer;
