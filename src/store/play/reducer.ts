import { findIndex } from 'lodash';
import { playActionTypes } from './action';


export enum PlayMode {
  ORDER = 'ORDER',
  CYCLE = 'CYCLE',
  RANDOM = 'RANDOM',
  SINGLE = 'SINGLE',
}

export type PlaylistItem = {
  cover: string
  name: string,
  ar: string,
  dt: number
  id: number
}

export interface PlayState {
  showPlaylist: boolean;
  playlist: Array<PlaylistItem>;
  playlistIndex: number;
  currentPlay: PlaylistItem | null;
  playMode: PlayMode;
}

const initialState: PlayState = {
  showPlaylist: false,
  playlist: [],
  playlistIndex: -1,
  currentPlay: null,
  playMode: PlayMode.ORDER
};


export default function reducer(state = initialState, action: any) {
  const { payload } = action;
  switch (action.type) {
    case playActionTypes.TOGGLE_PLAY_LIST_SHOW: {

      const { showPlaylist } = state;

      return Object.assign({}, state, {
        showPlaylist: typeof action.value === 'boolean' ? action.value : !showPlaylist
      });


    }

    case playActionTypes.ADD_PLAYLIST: {
      const { playlist } = state;

      const index = findIndex(playlist, ['id', payload.id]);

      let pl = playlist;
      let playlistIndex = -1;

      switch (index) {
        case -1:
          pl = [payload, ...playlist];
          playlistIndex = 0;
          break;

        default:
          playlistIndex = index;
      }

      return {
        ...state,
        currentPlay: payload,
        playlist: pl,
        playlistIndex
      };
    }


    case playActionTypes.PLAY_NEXT: {
      const { playlist, playlistIndex, currentPlay } = state;

      const target = playlist[playlistIndex + 1];

      let next = currentPlay;
      let index = playlistIndex;

      if (target) {
        next = target;
        index = playlistIndex + 1;
      }

      return {
        ...state,
        currentPlay: next,
        playlistIndex: index
      };
    }

    case playActionTypes.PLAY_PREV: {
      const { playlist, playlistIndex, currentPlay } = state;

      const target = playlist[playlistIndex - 1];

      let prev = currentPlay;
      let index = playlistIndex;

      if (target) {
        prev = target;
        index = playlistIndex - 1;
      }

      return {
        ...state,
        currentPlay: prev,
        playlistIndex: index
      };
    }
    case playActionTypes.PLAY_ALL: {
      if (Array.isArray(payload) && payload.length) {
        return {
          ...state,
          playlist: payload,
          currentPlay: payload[0],
          playlistIndex: 0
        };
      }

      return state;

    }
    case playActionTypes.CLEAR_PLAY_LIST: {
      return {
        ...state,
        playlist: [],
        playlistIndex: -1
      };
    }

    default:
      return state;
  }
}
