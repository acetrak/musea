import { Theme, Typography } from '@mui/material';
import { Link } from './index';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';

function Logo() {
  const theme = useTheme();
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
          [theme.breakpoints.down('md')]: {
            color: '#fff'
          }
        }}
      >
        Musea
      </Typography>
    </>
  );

}

export default Logo;