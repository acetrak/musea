import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import settingReducer, { settingState } from './setting/reducer';
import artistsReducer, { ArtistsState } from './artists/reducer';
import playReducer, { PlayState } from './play/reducer';

export interface State {
  setting: settingState,
  artists: ArtistsState,
  play: PlayState
}

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  setting: settingReducer,
  artists: artistsReducer,
  play: playReducer
});

const reducer = (state: any, action: any) => {

  return combinedReducer(state, action);

  // console.log('reducer')
  // // return combinedReducer(state, action);
  // if (action.type === HYDRATE) {
  //   console.log('HYDRATE');
  //   // const nextState = {
  //   //   ...state, // use previous state
  //   //   ...action.payload // apply delta from hydration
  //   // };
  //   // if (state.count.count) nextState.count.count = state.count.count; // preserve count value on client side navigation
  //   // return nextState;
  // } else {
  //   return combinedReducer(state, action);
  // }
};

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]));
};

export const wrapper = createWrapper(initStore);
