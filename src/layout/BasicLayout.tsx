import * as React from 'react';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Box, IconButton, Paper, Stack } from '@mui/material';
import Router from 'next/router';
import NProgress from 'nprogress';
import loadable from '@loadable/component';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfoIcon from '@mui/icons-material/Info';

import MenuIcon from '@mui/icons-material/Menu';

import { Logo, NavButton } from '../components';
import { ToggleMode } from '../features';
import useMediaQueryKey from '../hooks/useMediaQueryKey';

const PlayBar = loadable(() => import(`../features/play/PlayBar`));
const ScrollTop = loadable(() => import(`../components/ScrollTop`));

const SIDE_WIDTH = 240;
const MINI_SIDE_WIDTH = 64;

type  BasicLayoutProps = {
  children?: any
  pageProps: {
    showBack?: boolean
    hideAudio?: boolean
    isMiniWidth?: boolean
  }
}

const back = async () => {

  // @ts-ignore
  if (Router.router?._idx === 0) {
    NProgress.start();
    await Router.push('/');
    NProgress.done();
  } else
    Router.back();
};

const BasicLayout = (props: BasicLayoutProps) => {

  const { pageProps } = props;

  const isMiniWidth = pageProps?.isMiniWidth;
  const hideAudio = pageProps?.hideAudio;

  const [leftWidth, setLeftWidth] = useState(SIDE_WIDTH);

  const prevWidthRef = useRef<number>(SIDE_WIDTH);

  useEffect(() => {
    if (isMiniWidth) {
      setLeftWidth(MINI_SIDE_WIDTH);
    } else setLeftWidth(prevWidthRef.current);

  }, [isMiniWidth]);

  useEffect(() => {
    try {
      document.addEventListener('gesturestart', (e) => e.preventDefault());
      document.addEventListener('gesturechange', (e) => e.preventDefault());
    } catch (e) {

    }

  }, []);

  const key = useMediaQueryKey();

  const sideWidth = useMemo(() => {
    switch (key) {
      case 'xl':
        return leftWidth;
      case 'lg':
        return leftWidth;
      case 'md':
        return 0;
      case 'sm':
        return 0;
      case 'xs':
        return 0;
      default:
        return leftWidth;
    }
  }, [key, leftWidth]);

  const handleToggleLeftWidth = useCallback(() => {

    let w = leftWidth === SIDE_WIDTH ? MINI_SIDE_WIDTH : SIDE_WIDTH;
    setLeftWidth(w);
    prevWidthRef.current = w;
  }, [leftWidth]);

  console.log(' render BasicLayout');
  return (
    <>
      <div id="back-to-top-anchor" />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        <Paper
          sx={{
            width: sideWidth,
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1,
            // borderRight: '1px solid',
            // borderColor: 'divider',
            transition: 'all 0.1s '
          }}
        >

          <Box
            sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}
          >

            <Stack direction="row" alignItems="center" my={1}>
              <IconButton sx={{ ml: 1.5, mr: 1.5 }} onClick={handleToggleLeftWidth}>
                <MenuIcon />
              </IconButton>
              <Logo />

            </Stack>

            <NavButton
              href="/"
              icon={<HomeOutlinedIcon sx={{ color: 'text.primary' }} />}
              selectedIcon={<HomeIcon />}
            >
              首页
            </NavButton>
            <NavButton
              href="/search"
              icon={<SearchOutlinedIcon sx={{ color: 'text.primary' }} />}
              selectedIcon={<SearchIcon />}
            >
              搜索
            </NavButton>
            <NavButton
              href="/about"
              icon={<InfoOutlinedIcon sx={{ color: 'text.primary' }} />}
              selectedIcon={<InfoIcon />}
            >
              关于
            </NavButton>
            <div style={{ flex: 1 }} />

            <Box
              sx={{ p: 1 }}
            >
              <ToggleMode />
            </Box>
          </Box>

        </Paper>

        <Box
          id="main"
          style={{ marginLeft: `${sideWidth}px`, transition: 'all 0.1s ' }}
        >
          {/*<Box sx={{ py: 3, position: 'sticky', top: 0, borderRadius: 0 }}>*/}
          {/*  <Box sx={{ position: 'absolute', left: 8 }}>*/}
          {/*    <Zoom in={!!pageProps?.showBack}>*/}
          {/*      <IconButton onClick={back}>*/}
          {/*        <ArrowBackIosNewIcon />*/}
          {/*      </IconButton>*/}
          {/*    </Zoom>*/}
          {/*  </Box>*/}

          {/*  <Container maxWidth="xl">*/}
          {/*    <Stack flexDirection="row" alignItems="center" sx={{ position: 'relative' }}>*/}

          {/*    </Stack>*/}
          {/*  </Container>*/}
          {/*</Box>*/}


          {props.children}

          <PlayBar sideWidth={sideWidth} hide={hideAudio} />
        </Box>
      </Box>

      <div id="playlist" />
      <ScrollTop />


    </>
  );
};

export default BasicLayout;