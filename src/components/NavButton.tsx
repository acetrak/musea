import { alpha, Box, CardActionArea, Theme, Typography } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import useMeasure from 'react-use-measure';
import { ReactNode, useMemo } from 'react';
import { NextRouter, useRouter } from 'next/router';


import { Link } from '../components';

type NavButtonProps = {
  children?: any
  href?: string | undefined
  icon?: ReactNode
  selectedIcon?: ReactNode
}

function NavButton(props: NavButtonProps) {

  const { children, href, icon, selectedIcon } = props;

  const [ref, { width }] = useMeasure();

  const router: NextRouter = useRouter();

  const selected = useMemo(() => {

    let url = String(href);
    if (url.indexOf('?') != -1) {
      url = url.split('?')[0];
    }

    return router.pathname === url;
  }, [router, href]);


  const style = useSpring({
    from: {
      width: 0
    },
    to: {
      width: selected ? width : 0
    }
  });

  const exr = useMemo(() => href ? {
    href,
    component: Link
  } : {}, [href]);

  return (

    <CardActionArea {...exr} sx={{ mt: 1.5, color: 'primary.main' }}>

      <Box
        sx={{
          p: 1.5,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}
        ref={ref}
      >
        <Box
          sx={{
            width: 4,
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            bgcolor: 'primary.main',
            display: selected ? 'block' : 'none',
            boxShadow: (theme: Theme) => theme.shadows[2]
          }}
        />

        <Box
          component={animated.div}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1)
            // backgroundImage: (theme: Theme) =>
            //   `linear-gradient(to right, 
            //    ${alpha(theme.palette.primary.main, 0.9)},
            //    ${alpha(theme.palette.primary.main, 0.7)} 10%,
            //    ${alpha(theme.palette.primary.main, 0.1)})`
          }}
          style={style as any}
        />
        <Box
          sx={{
            mr: 2.5, ml: 1, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}
        >
          {
            selected ? selectedIcon : icon
          }
        </Box>
        <Typography className="nowrap1" color={selected ? 'primary.main' : 'text.primary'}>{children}</Typography>
      </Box>

    </CardActionArea>

  );
}

export default NavButton;