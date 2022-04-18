import { Dispatch } from 'redux';
import { PlaylistItem } from './reducer';

export const playActionTypes = {
  TOGGLE_PLAY_LIST_SHOW: 'TOGGLE_PLAY_LIST_SHOW',
  ADD_PLAYLIST: 'ADD_PLAYLIST',
  PLAY_ALL: 'PLAY_ALL',
  CLEAR_PLAY_LIST: 'CLEAR_PLAY_LIST',
  PLAY_NEXT: 'PLAY_NEXT',
  PLAY_PREV: 'PLAY_PREV'
};

export const togglePlayListShow = (value?: boolean) => (dispatch: Dispatch) => {

  return dispatch({
    type: playActionTypes.TOGGLE_PLAY_LIST_SHOW,
    value
  });
};

export const addPlaylist = (value?: PlaylistItem) => (dispatch: Dispatch) => {

  return dispatch({
    type: playActionTypes.ADD_PLAYLIST,
    payload: value
  });
};

export const playAll = (list?: Array<PlaylistItem>) => (dispatch: Dispatch) => {

  return dispatch({
    type: playActionTypes.PLAY_ALL,
    payload: list
  });
};

export const clearPlayList = () => (dispatch: Dispatch) => {

  return dispatch({
    type: playActionTypes.CLEAR_PLAY_LIST

  });
};

export const playNext = () => (dispatch: Dispatch) => {

  return dispatch({
    type: playActionTypes.PLAY_NEXT
  });
};

export const playPrev = () => (dispatch: Dispatch) => {

  return dispatch({
    type: playActionTypes.PLAY_PREV

  });
};

