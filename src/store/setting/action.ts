import { Dispatch } from 'redux';

export const settingActionTypes = {
  CHANGE_THEME_MODE: 'CHANGE_THEME_MODE'
};

export const changeThemeMode = (mode?: string) => (dispatch: Dispatch) => {
  return dispatch({
    type: settingActionTypes.CHANGE_THEME_MODE,
    mode
  });
};

