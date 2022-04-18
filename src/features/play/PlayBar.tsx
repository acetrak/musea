import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { alpha, Box, ClickAwayListener, IconButton, Portal, Slide, Stack, Theme, Typography } from '@mui/material';
import { connect } from 'react-redux';
import SkipNextOutlinedIcon from '@mui/icons-material/SkipNextOutlined';
import SkipPreviousOutlinedIcon from '@mui/icons-material/SkipPreviousOutlined';
import PlaylistPlayOutlinedIcon from '@mui/icons-material/PlaylistPlayOutlined';
import { Dispatch } from 'redux';
import { useSnackbar } from 'notistack';

import AudioPlayer, { AudioRef } from '../../components/AudioPlayer';
import Playlist from './Playlist';
import Image from '../../components/Image';
import { playNext, playPrev, togglePlayListShow } from '../../store/play/action';
import { State } from '../../store';
import { PlaylistItem } from '../../store/play/reducer';


type PlayBarProps = {
  sideWidth: number
  hide?: boolean
  isMobile?: boolean
}

const PlayBar = (props: PlayBarProps) => {

  const { sideWidth, hide, isMobile } = props;

  // @ts-ignore
  const { currentPlay, playlistLength, dispatch } = props;

  const { enqueueSnackbar } = useSnackbar();

  const audioRef = React.useRef<AudioRef>(null);

  useEffect(() => {
    if (audioRef.current && hide) {
      audioRef.current.pause();
    }
  }, [hide]);


  const handleClickAway = () => {
    togglePlayListShow(false)(dispatch);
  };

  const toggleShow = () => {
    togglePlayListShow()(dispatch);
  };

  const next = useCallback(() => {
    playNext()(dispatch);
  }, [dispatch]);

  const onEnded = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    next();
  }, [next]);

  const prev = useCallback(() => {
    playPrev()(dispatch);
  }, [dispatch]);


  const onError = useCallback(() => {


    enqueueSnackbar('播放出错', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      },
      variant: 'error'
    });

    if (audioRef.current) {
      audioRef.current.pause();
    }

    // setTimeout(() => {
    //   next();
    // }, 1200);
  }, [enqueueSnackbar]);

  const url = useMemo(() => {
    if (currentPlay?.id)
      return `https://music.163.com/song/media/outer/url?id=${currentPlay?.id}.mp3`;
  }, [currentPlay]);


  const inProp = !hide && (Boolean(currentPlay) || Boolean(playlistLength));

  return (
    <Slide in={inProp} direction="up">

      <Box
        sx={{
          position: 'fixed',
          bottom: isMobile ? 54 : 0,
          left: sideWidth,
          right: 0,
          zIndex: 1200,
          boxShadow: '3px -1px 6px 2px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(20px)',
          bgcolor: (theme: Theme) => alpha(theme.palette.background.default, 0.4),
          transition: 'all 0.2s ease'
        }}
      >

        <AudioPlayer isMobile={isMobile} url={url} ref={audioRef} onEnded={onEnded} onError={onError} />


        <Box
          sx={{
            height: '100%',
            position: 'relative'
          }}
        >

          <Stack flexDirection="row" alignItems="center">
            {
              currentPlay?.cover ? (
                <Image
                  alt=""
                  src={currentPlay?.cover}
                  width={isMobile ? 60 : 74}
                  height={isMobile ? 60 : 74}
                />
              ) : <div style={{ height: 64 }} />
            }

            <Stack justifyContent="center" sx={{ ml: 2, display: currentPlay ? 'inline-block' : 'none' }}>
              <Typography variant="subtitle1" sx={{ maxWidth: isMobile ? 140 : 'unset' }} className="nowrap1">
                {currentPlay?.name}
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: isMobile ? 120 : 200 }} className="nowrap1">
                {currentPlay?.ar}
              </Typography>

            </Stack>

            <Stack sx={{ ml: 'auto', pr: isMobile ? 0 : 3 }} alignItems="center" justifyContent="center">

              <Stack flexDirection="row" alignItems="center" justifyContent="center">
                <div id="audio-duration" style={{ display: isMobile ? 'none' : 'block' }} />
                <div id="audio-volume-btn" style={{ display: isMobile ? 'none' : 'block' }} />
                {
                  isMobile && (
                    <div id="audio-play-btn" />
                  )
                }
                <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={handleClickAway}>
                  <div>
                    <IconButton onClick={toggleShow}>
                      <PlaylistPlayOutlinedIcon />
                    </IconButton>

                    <Portal container={() => document?.querySelector('#playlist')}>
                      <Playlist isMobile={isMobile} />
                    </Portal>
                  </div>
                </ClickAwayListener>
              </Stack>

            </Stack>
          </Stack>

          {
            !isMobile && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  pointerEvents: 'none',
                  display: isMobile ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  zIndex: isMobile ? -100 : 50

                }}
              >
                <Stack
                  sx={{ height: '100%', pointerEvents: 'auto' }} flexDirection="row" alignItems="center"
                  justifyContent="center"
                >

                  <IconButton onClick={prev}>
                    <SkipPreviousOutlinedIcon />
                  </IconButton>

                  <div id="audio-play-btn" />

                  <IconButton onClick={next}>
                    <SkipNextOutlinedIcon />
                  </IconButton>
                </Stack>
              </Box>
            )
          }


        </Box>
      </Box>

    </Slide>
  );
};


const mapStateToProps = (state: State) => {
  return {
    currentPlay: state.play.currentPlay,
    playlistLength: state.play.playlist.length
  };
};

export default React.memo(connect(mapStateToProps)(PlayBar));