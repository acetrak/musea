import { Dispatch } from 'redux';

export const artistsActionTypes = {
  SET_ROWS_PER_PAGE: 'artistsActionTypes_SET_ROWS_PER_PAGE',
  SET_PAGE: 'artistsActionTypes_SET_PAGE',
  SET_ARTIST_ID: 'artistsActionTypes_SET_ARTIST_ID',
  SET_STATE: 'artistsActionTypes_SET_STATE'
};

export const setRowsPerPage = (rowsPerPage?: number) => (dispatch: Dispatch) => {

  return dispatch({
    type: artistsActionTypes.SET_ROWS_PER_PAGE,
    rowsPerPage
  });
};

export const setPage = (page?: number) => (dispatch: Dispatch) => {

  return dispatch({
    type: artistsActionTypes.SET_PAGE,
    page
  });
};

export const setArtistID = (id?: number) => (dispatch: Dispatch) => {
  return dispatch({
    type: artistsActionTypes.SET_ARTIST_ID,
    id
  });
};

export const setState = (newState: any) => (dispatch: Dispatch) => {

  return dispatch({
    type: artistsActionTypes.SET_STATE,
    newState
  });
};



