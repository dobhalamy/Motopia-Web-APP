import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initState = {};
const { NODE_ENV } = process.env;
export default function initializeStore(initialState = initState) {
  return createStore(
    rootReducer,
    initialState,
    NODE_ENV === 'development'
      ? composeWithDevTools(applyMiddleware(thunk))
      : applyMiddleware(thunk));
}
