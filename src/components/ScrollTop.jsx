import * as React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Box, Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ScrollTop(props) {
  const { children, isMobile } = props;

  const trigger = useScrollTrigger({
    target: undefined,
    disableHysteresis: true,
    threshold: 800,
  });

  const handleClick = (event) => {
    const anchor = document?.querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth', block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', zIndex: 100, bottom: isMobile ? 140 : 90, right: 16 }}
      >
        {
          children ? children : (
            <Fab color="secondary" size="small">
              <KeyboardArrowUpIcon />
            </Fab>
          )
        }
      </Box>
    </Zoom>
  );
}

export default ScrollTop;
