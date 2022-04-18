import { Typography } from '@mui/material';
import { Link } from './index';
import * as React from 'react';

function Logo() {

  return (
    <>
      <Typography
        component={Link}
        href={'/'}
        lineHeight={3}
        fontWeight="600"
        variant="h5"
        align="center"
        color="primary.main"
        sx={{
          textDecoration: 'none',
          display: 'block',

        }}
      >
        Melody
      </Typography>
    </>
  );

}

export default Logo;