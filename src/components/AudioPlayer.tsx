import * as React from 'react';
import { ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Box, ClickAwayListener, Grow, IconButton, Paper, Popper, Portal, Slider, Typography } from '@mui/material';

import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
// @ts-ignore
import ReactPlayer from 'react-player/lazy';
import { second2Minute } from '../utils/utils';

function VolumeI({ muted, volume }: { muted: boolean, volume: number }) {

  return (muted || volume <= 0) ? <VolumeOffIcon sx={{ fontSize: 26, width: 32, height: 32 }} /> :
    volume > 0.5 ? <VolumeUpRounded sx={{ fontSize: 28, width: 32, height: 32 }} /> :
      <VolumeDownIcon sx={{ fontSize: 26, width: 32, height: 32 }} />;
}

const VolumeIcon = React.memo(VolumeI);


type VolumePanelProps = {
  children: ReactNode
  volume: number
  onVolumeChange: (event: Event, value: number | number[]) => void
}

function VolumeP(props: VolumePanelProps) {
  const { children, volume, onVolumeChange } = props;

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    // @ts-ignore
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };


  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current && !open) {
      // @ts-ignore
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  return (
    <Box>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
      >
        {children}
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="top"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'bottom center' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <Box sx={{ height: 200, width: 60, py: 3, px: 2 }}>
                  <Slider
                    onChange={onVolumeChange}
                    min={0}
                    max={1}
                    step={0.01}
                    size="small"
                    sx={{
                      '& input[type="range"]': {
                        WebkitAppearance: 'slider-vertical'
                      }
                    }}
                    orientation="vertical"
                    value={volume}
                    aria-label="Temperature"
                  />
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

    </Box>
  );
}

const VolumePanel = React.memo(VolumeP);

export type AudioRef = {
  togglePlay: () => void
  pause: () => void
}

type Progress = {
  loaded: number
  loadedSeconds: number
  played: number
  playedSeconds: number
}

type AudioPlayerProps = {
  url?: string | undefined
  onError: () => void
  onEnded: () => void
  isMobile?: boolean
}


const AudioPlayer = React.forwardRef(function AudioPlayer(props: AudioPlayerProps, ref: React.ForwardedRef<AudioRef>) {

  const { url, isMobile, onError: handleError, onEnded: handleEnded } = props;

  const player = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [seek, setSeek] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progressState, setProgressState] = useState<Progress>({
    loaded: 0,
    loadedSeconds: 0,
    played: 0,
    playedSeconds: 0
  });

  // const [buffering, setBuffering] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const playedSeconds = useMemo(() => progressState.playedSeconds, [progressState.playedSeconds]);
  const played = useMemo(() => progressState.played, [progressState.played]);
  const loaded = useMemo(() => progressState.loaded, [progressState.loaded]);

  useEffect(() => {
    setPlaying(true);
  }, [url]);

  useImperativeHandle(ref, () => ({
    togglePlay: () => {

      setPlaying(prevState => !prevState);
    },
    pause: () => {
      console.log('pause');
      setPlaying(false);
    }
  }), []);

  const toggle = useCallback(() => {
    setPlaying(prevState => !prevState);
  }, []);


  const onPlay = useCallback(() => {

  }, []);

  // const onBuffer = useCallback(() => {
  //   setBuffering(true);
  // }, []);
  //
  // const onBufferEnd = useCallback(() => {
  //   setBuffering(false);
  // }, []);

  const onProgress = useCallback((e: Progress) => {

      if (!seek) {
        setProgressState(e);
      }

    }, [seek]
  );

  const onDuration = useCallback((value: number) => {

    setDuration(value);
  }, []);

  const onError = useCallback(() => {

    setPlaying(false);
    handleError();
  }, [handleError]);

  const onEnded = useCallback(() => {
    handleEnded();
  }, [handleEnded]);

  // 外部调用

  // 其它

  const onVolumeChange = useCallback((event: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      setVolume(value);
    }
  }, []);

  const onSliderChange = useCallback((_, value: number | number[]) => {
      if (typeof value === 'number') {
        setProgressState(prevState => ({ ...prevState, playedSeconds: value }));
      }
    }, []
  );


  const onMouseUp = useCallback(() => {
    setSeek(false);
    // @ts-ignore
    player?.current?.seekTo(playedSeconds, 'seconds');

  }, [playedSeconds]);

  const onMouseDown = useCallback(() => {
    setSeek(true);
  }, []);

  return (
    <>


      <Slider
        sx={{
          position: 'absolute',
          left: 0,
          top: isMobile ? -18 : -14,
          right: 0,
          fontSize: 0,
          zIndex: 2
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onChange={onSliderChange}
        size="small"
        value={playedSeconds || 0}
        max={duration}
        min={0}
        step={0.01}
      />
      <LinearProgress
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          zIndex: 1,

          [`& .${linearProgressClasses.dashed}`]: {
            display: 'none'
          }
        }} variant="buffer" value={played * 100} valueBuffer={loaded * 100}
      />

      {/*@ts-ignore*/}
      <ReactPlayer
        ref={player}
        onPlay={onPlay}
        onProgress={onProgress}
        onDuration={onDuration}
        onError={onError}
        onEnded={onEnded}
        playing={playing}
        volume={volume}
        url={url}
        width={0}
        height={0}
      />

      <Portal container={() => document?.querySelector('#audio-play-btn')}>
        <IconButton onClick={toggle}>
          {
            playing ? (<PauseCircleOutlinedIcon sx={{ fontSize: 40 }} />) : (
              <PlayCircleOutlinedIcon sx={{ fontSize: 40 }} />)
          }
        </IconButton>
      </Portal>

      <Portal container={() => document?.querySelector('#audio-volume-btn')}>
        <VolumePanel volume={volume} onVolumeChange={onVolumeChange}>
          <VolumeIcon muted={false} volume={volume} />
        </VolumePanel>
      </Portal>

      <Portal container={() => document?.querySelector('#audio-duration')}>
        <Typography variant="body2" mr={2}>
          {second2Minute(progressState.playedSeconds)}/{second2Minute(duration)}
        </Typography>
      </Portal>

    </>
  );
});


export default React.memo(AudioPlayer, );