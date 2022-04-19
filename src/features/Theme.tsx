import * as React from 'react';

import { CssBaseline, ThemeProvider, responsiveFontSizes } from '@mui/material';
import { connect } from 'react-redux';
// import { Dispatch } from 'redux';

import { darkTheme, lightTheme } from '../styles/theme';


type ThemeProps = {
  children: any
  // mode?: 'dark' | 'light' | undefined
  // dispatch: Dispatch
}

function Theme(props: ThemeProps) {

  // @ts-ignore
  const { mode, dispatch } = props;
  const theme = React.useMemo(() => {
    return responsiveFontSizes(mode === 'dark' ? darkTheme : lightTheme);
  }, [mode]);


  React.useEffect(() => {
    let mode = 'dark';

    try {
      mode = localStorage.getItem('mode') || 'dark';
    } catch (e) {
      console.log(e);
    }

    dispatch({
      type: 'CHANGE_THEME_MODE',
      mode
    });

  }, [dispatch]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {
    mode: state.setting.themeMode
  };
};
export default connect(mapStateToProps)(Theme);