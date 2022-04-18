import * as React from 'react';
import { memo } from 'react';
import { Box, IconButton, Zoom } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';


import { changeThemeMode } from '../store/setting/action';
import { State } from '../store';


type  ToggleModeProps = {}

function ToggleMode(props: ToggleModeProps) {


  // @ts-ignore
  const { toggle, mode } = props;

  const click = React.useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    <Box sx={{ position: 'relative', width: 40, height: 40 }}>
      <Zoom in={mode === 'dark'} unmountOnExit>
        <IconButton onClick={click} sx={{ position: 'absolute', top: 0, left: 0 }}>
          <LightModeIcon />
        </IconButton>
      </Zoom>

      <Zoom in={mode === 'light'} unmountOnExit>
        <IconButton onClick={click} sx={{ position: 'absolute', top: 0, left: 0 }}>
          <DarkModeIcon />
        </IconButton>
      </Zoom>
    </Box>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    toggle: bindActionCreators(changeThemeMode, dispatch)
  };
};

const mapStateToProps = (state: State) => {
  return {
    mode: state.setting.themeMode
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(ToggleMode));