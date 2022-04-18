import { artistsActionTypes } from './action';


export interface ArtistsState {
  rowsPerPage: number;
  page: number;
  artistId: number | null | undefined;
}


const initialState: ArtistsState = {
  rowsPerPage: 12,
  page: 0,
  artistId: null
};


export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case artistsActionTypes.SET_ROWS_PER_PAGE: {
      return Object.assign({}, state, {
        rowsPerPage: action.rowsPerPage
      });

    }
    case artistsActionTypes.SET_PAGE: {
      return Object.assign({}, state, {
        page: action.page
      });
    }
    case artistsActionTypes.SET_ARTIST_ID: {

      let { artistId, rowsPerPage, page } = state;

      if (artistId !== action.id) {
        rowsPerPage = 12;
        page = 0;
      }
      return Object.assign({}, state, {
        artistId: action.id,
        rowsPerPage,
        page
      });
    }
    case artistsActionTypes.SET_STATE: {
      return Object.assign({}, state, {
        ...action.newState
      });
    }
    default:
      return state;
  }
}
