import * as React from 'react';
import { Stack, Paper, Slide, useScrollTrigger, AppBar, Toolbar } from '@mui/material';
import { Logo } from '../components';
import ToggleMode from './ToggleMode';

type HideOnScrollProps = {
  children: any
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: undefined
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}


function MobileHeader() {

  return (
    <>

      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <Stack direction="row" sx={{flex:1}} alignItems="center" justifyContent="space-between">
              <Logo />
              <ToggleMode />
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />

      {/*<Paper sx={{ px: 1, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500 }}>*/}
      {/*  */}
      {/*</Paper>*/}
    </>
  );
}

export default MobileHeader;