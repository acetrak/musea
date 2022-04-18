import { settingActionTypes } from './action';


export interface settingState {
  themeMode: 'dark' | 'light';
}

const initialState: settingState = {
  themeMode: 'dark' as const
};


export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case settingActionTypes.CHANGE_THEME_MODE: {

      const { themeMode } = state;

      let newMode = action.mode;

      if (!newMode) {
        newMode = themeMode === 'dark' ? 'light' : 'dark';
      }

      try {
        localStorage.setItem('mode', newMode);
      } catch (e) {
        console.log(e);

      }

      return Object.assign({}, state, {
        themeMode: newMode
      });

    }

    default:
      return state;
  }
}
