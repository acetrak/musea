import * as React from 'react';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Portal,
  Slider,
  Stack,
  Typography
} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { animated, useSpring } from '@react-spring/web';
import { useGesture, useMove } from '@use-gesture/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PauseIcon from '@mui/icons-material/Pause';
import { debounce, find } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FilterTiltShiftIcon from '@mui/icons-material/FilterTiltShift';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CropLandscapeIcon from '@mui/icons-material/CropLandscape';

import { isSafari, second2Minute } from '../utils/utils';

import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';


const PLAY_SPEED = [
  {
    label: '',
    value: 0.25
  },
  {
    label: '',
    value: 0.5
  },
  {
    label: '',
    value: 0.75
  },
  {
    label: '正常',
    value: 1
  },
  {
    label: '',
    value: 1.25
  },
  {
    label: '',
    value: 1.75
  },
  {
    label: '',
    value: 2
  }
];


type WrapVideoProps = {
  children?: ReactNode[]
  playing: boolean
  playbackRate: number
  onPlaybackRate: (value: number) => void
  onClick?: () => void
  onBrs: (value: { url: string, r: number }) => void
  brsConfig: Array<{ url: string, r: number }>
  currentBrs: number
  isMobile?: boolean
}
const WrapVideo = React.forwardRef(function WrapVideo(props: WrapVideoProps, ref) {

  const { children, playing, playbackRate, brsConfig, currentBrs, isMobile, onPlaybackRate, onBrs, onClick } = props;

  const [menu, setMenu] = useState('MENU');
  const [showSetting, setShowSetting] = useState(false);

  useEffect(() => {
    setMenu('MENU');
  }, [showSetting]);

  const [style, api] = useSpring(() => ({ y: 100 }));

  const fn = useMemo(() => debounce((playing: boolean) => {
    if (playing) {
      api.start({ y: 100 });
      setShowSetting(false);
    }
  }, 2500), [api]);

  const bind = useMove((() => {
    api.start({ y: 0 });

    fn(playing);
  }));

  useEffect(() => {
    if (!playing)
      api.start({ y: 0 });
  }, [api, playing]);

  const handleSelectSpeed = (value: number) => {
    onPlaybackRate(value);
    setMenu('MENU');

  };

  const handleSelectBrs = (item: { url: string, r: number }) => {
    onBrs(item);
    setMenu('MENU');
  };

  const targetSpeed = useMemo(() => find(PLAY_SPEED, ['value', playbackRate]), [playbackRate]);

  const onClickAway = () => {
    setShowSetting(false);
  };

  const onSettingClick = useCallback((e: any) => {

    setShowSetting(prevState => !prevState);
  }, []);

  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onWrapClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <Box
      ref={ref}
      onClick={onWrapClick}
      {...bind()}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',

        zIndex: 3
      }}
    >
      {children?.[0]}

      <Box
        component={animated.div}
        sx={{
          width: '100%',
          p: 1,
          position: 'absolute',
          left: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))',
          zIndex: 2
        }}
        style={style as any}
        onClick={stopPropagation}
      >
        {children?.[1]}
      </Box>

      {children?.[2]}

      {
        showSetting && (
          <Box
            onClick={stopPropagation}
            sx={{
              position: 'absolute',
              top: 0, right: 0,
              left: 0,
              bottom: 0,
              zIndex: 6
            }}
          />
        )
      }

      <ClickAwayListener
        onClickAway={onClickAway}
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
      >
        <div onClick={stopPropagation}>
          <Box

            sx={{
              position: 'absolute',
              right: 16,
              bottom: 80,
              width: 250,
              backgroundColor: 'rgba(0,0,0,0.75)',
              py: 1,
              overflow: 'hidden',
              color: '#fff',
              display: showSetting ? 'block' : 'none',
              zIndex: 7
            }}
          >
            <TransitionGroup>

              {
                menu === 'MENU' ? (
                  <Collapse>
                    <List>
                      <ListItemButton onClick={() => setMenu('SPEED')} sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon sx={{ minWidth: 'unset', mr: 1, color: 'inherit' }}><FilterTiltShiftIcon
                          sx={{ color: 'inherit' }}
                        /></ListItemIcon>
                        <Typography variant="body2">播放速度</Typography>
                        <Typography
                          variant="body2" sx={{ ml: 'auto' }}
                        >
                          {targetSpeed?.label || targetSpeed?.value}
                        </Typography>
                        <ChevronRightIcon sx={{ fontSize: 22 }} />
                      </ListItemButton>

                      <ListItemButton onClick={() => setMenu('BRS')} sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon sx={{ minWidth: 'unset', mr: 1, color: 'inherit' }}>
                          <TuneIcon sx={{ color: 'inherit' }} />
                        </ListItemIcon>
                        <Typography variant="body2">画质</Typography>
                        <Typography variant="body2" sx={{ ml: 'auto' }}>{currentBrs}p</Typography>
                        <ChevronRightIcon sx={{ fontSize: 22 }} />
                      </ListItemButton>
                    </List>
                  </Collapse>
                ) : null
              }
              {
                menu === 'SPEED' ? (
                  <Collapse>
                    <List>
                      <Stack
                        sx={{ cursor: 'pointer' }} px={2} pt={0.5} pb={1.5} flexDirection="row" alignItems="center"
                        onClick={() => setMenu('MENU')}
                      >
                        <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2">播放速度</Typography>
                      </Stack>
                      <Divider />

                      {
                        PLAY_SPEED.map(item => (
                          <ListItemButton
                            onClick={() => handleSelectSpeed(item.value)} key={item.value}
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                              {
                                item.value === playbackRate ? (
                                  <CheckIcon
                                    sx={{ minWidth: 'unset', mr: 1, fontSize: 20, color: 'inherit' }}
                                  ><TuneIcon /></CheckIcon>
                                ) : null
                              }
                            </ListItemIcon>
                            <Typography variant="body2">{item.label || item.value}</Typography>
                          </ListItemButton>
                        ))
                      }


                    </List>
                  </Collapse>
                ) : null
              }


              {
                menu === 'BRS' ? (
                  <Collapse>
                    <List>
                      <Stack
                        sx={{ cursor: 'pointer' }} px={2} pt={0.5} pb={1.5} flexDirection="row" alignItems="center"
                        onClick={() => setMenu('MENU')}
                      >
                        <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2">画质</Typography>
                      </Stack>
                      <Divider />

                      {
                        brsConfig.map(item => (
                          <ListItemButton
                            onClick={() => handleSelectBrs(item)} key={item.r}
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                              {
                                item.r === currentBrs ? (
                                  <CheckIcon
                                    sx={{ minWidth: 'unset', mr: 1, fontSize: 20, color: 'inherit' }}
                                  ><TuneIcon /></CheckIcon>
                                ) : null
                              }
                            </ListItemIcon>
                            <Typography variant="body2">{item.r}p</Typography>
                          </ListItemButton>
                        ))
                      }


                    </List>
                  </Collapse>
                ) : null
              }

            </TransitionGroup>
          </Box>
          <Portal disablePortal={isMobile} container={() => document?.querySelector('#v_setting')}>
            <IconButton color="inherit" onClick={onSettingClick}>
              <SettingsIcon sx={{ fontSize: 26 }} />
            </IconButton>
          </Portal>
        </div>
      </ClickAwayListener>


    </Box>
  );
});

type Progress = {
  loaded: number
  loadedSeconds: number
  played: number
  playedSeconds: number
}

type ControlProps = {
  style?: any
  onPlayClick: () => void
  onMouseDown: (e: any) => void
  onMouseUp: (e: any) => void

  onWidthFull?: () => void
  onVolumeClick: () => void

  onScreenFull?: () => void

  onSliderChange: (e: any, value: number[] | number) => void
  onVolumeChange: (e: any, value: number[] | number) => void
  playing: boolean
  muted: boolean
  duration: number
  playedSeconds: number
  volume: number
  loaded: number
  played: number
  isScreenFull?: boolean

}

function VolumeI({ muted, volume }: { muted: boolean, volume: number }) {

  return (muted || volume <= 0) ? <VolumeOffIcon sx={{ fontSize: 28, width: 32, height: 32 }} /> :
    volume > 0.5 ? <VolumeUpRounded sx={{ fontSize: 32, width: 32, height: 32 }} /> :
      <VolumeDownIcon sx={{ fontSize: 28, width: 32, height: 32 }} />;
}

const VolumeIcon = React.memo(VolumeI);

const ControlBar = (props: ControlProps) => {
  const {
    playing,
    duration,
    playedSeconds,
    loaded,
    played,
    muted,
    volume,
    isScreenFull,

    onPlayClick,
    onSliderChange,
    onMouseDown,
    onMouseUp,
    onScreenFull,
    onVolumeClick,
    onVolumeChange,
    onWidthFull

  } = props;


  const [style, api] = useSpring(() => ({ width: 0 }));


  const bind = useGesture({
    onHover: state => {
      api.start({ width: state.hovering ? 120 : 0 });
    },
    onDrag: state => {
      if (state.hovering) return;
      api.start({ width: state.dragging ? 120 : 0 });
    }
  });

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          left: 8,
          top: -12,
          right: 8
        }}
      >
        <Slider
          sx={{
            position: 'relative',
            zIndex: 2
          }}
          onMouseDown={onMouseDown} onMouseUp={onMouseUp} onChange={onSliderChange} size="small"
          value={playedSeconds || 0} max={duration} min={0} step={0.01}
        />
        <LinearProgress
          sx={{
            position: 'absolute',
            left: 0,
            top: 12,
            right: 0,
            zIndex: 1,
            [`& .${linearProgressClasses.dashed}`]: {
              display: 'none'
            }
          }} variant="buffer" value={played * 100} valueBuffer={loaded * 100}
        />
      </Box>
      <Stack flexDirection="row" alignItems="center" color="#fff">
        <IconButton onClick={onPlayClick} color="primary">
          {
            playing ? <PauseIcon sx={{ fontSize: 32 }} />
              : <PlayArrowIcon sx={{ fontSize: 32 }} />
          }
        </IconButton>

        <Stack sx={{ touchAction: 'none' }} flexDirection="row" alignItems="center"  {...bind()}>

          <IconButton color="inherit" onClick={onVolumeClick}>
            <VolumeIcon muted={muted} volume={volume} />
          </IconButton>

          <Box
            component={animated.div}
            style={style as any}
            sx={{
              overflow: 'hidden',
              mr: 2,
              display: 'flex',
              touchAction: 'none'
            }}
          >
            <Slider
              disableSwap
              size="small" onChange={onVolumeChange} value={volume} max={1} min={0} step={0.01}
              sx={{
                mx: 2,
                color: '#fff',
                touchAction: 'none',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#fff',
                  '&:before': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0)'
                  },
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none'
                  }
                }
              }}
            />
          </Box>
        </Stack>
        <Typography variant="caption" color="inherit">
          {second2Minute(playedSeconds)} / {second2Minute(duration)}
        </Typography>

        <div id="v_setting" style={{ marginLeft: 'auto' }} />

        {
          !isScreenFull && (
            <IconButton onClick={onWidthFull} color="inherit">
              <CropLandscapeIcon sx={{ fontSize: 32 }} />
            </IconButton>
          )
        }


        <IconButton onClick={onScreenFull} color="inherit">
          {
            isScreenFull ? <FullscreenExitIcon sx={{ fontSize: 32 }} /> : <FullscreenIcon sx={{ fontSize: 32 }} />
          }
        </IconButton>

      </Stack>
    </>
  );
};

const Control = React.memo(ControlBar);

type PlayerProps = {
  src: string
  urlBrs: number
  brsConfig: Array<{ url: string, r: number }>
  onWidthFull?: () => void
  onScreenFull?: () => void
  isScreenFull?: boolean
  isMobile?: boolean
}

function VideoPlayer(props: PlayerProps) {

  const { src, urlBrs, brsConfig, onWidthFull, isScreenFull, onScreenFull, isMobile } = props;

  const [safari, setSafari] = useState<boolean | undefined>(undefined);

  const player = useRef(null);

  const rootElRef = useRef(null);
  const currentTime = useRef(-1); // 当切换画质时记录播放到的时间 -1:可认为没有切换画质

  const [playing, setPlaying] = useState(false);
  const [seek, setSeek] = useState(false);
  const [duration, setDuration] = useState(0);
  // const [playedSeconds, setPlayedSeconds] = useState(0);
  const [progressState, setProgressState] = useState<Progress>({
    loaded: 0,
    loadedSeconds: 0,
    played: 0,
    playedSeconds: 0
  });
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const [playParam, setPlayParameters] = useState(() => ({ url: src, r: urlBrs }));

  const playedSeconds = useMemo(() => progressState.playedSeconds, [progressState.playedSeconds]);
  const played = useMemo(() => progressState.played, [progressState.played]);
  const loaded = useMemo(() => progressState.loaded, [progressState.loaded]);


  useEffect(() => {
    const isS = isSafari();
    setSafari(isS);

  }, []);

  useEffect(() => {
    setPlayParameters(prevState => ({ ...prevState, url: src, r: urlBrs }));
    currentTime.current = -1;
  }, [src, urlBrs]);


  const onPlayClick = useCallback(() => {
    setPlaying(prevState => !prevState);
    setBuffering(false);
  }, []);

  const onEnded = useCallback(() => {
      setPlaying(false);
    }, []
  );

  const onProgress = useCallback((e: Progress) => {

      if (!seek) {
        setProgressState(e);
      }
      // setPlayedSeconds(e.playedSeconds);
    }, [seek]
  );

  const onPlay = useCallback(() => {

      if (currentTime.current >= 0) {

        // @ts-ignore
        player?.current?.seekTo(currentTime.current, 'seconds');
        currentTime.current = -1;
      }

    }, []
  );

  const onBuffer = useCallback(() => {
      setBuffering(true);
    }, []
  );

  const onBufferEnd = useCallback(() => {
      setBuffering(false);
    }, []
  );

  const onDuration = useCallback((value: number) => {
      setDuration(value);
    }, []
  );

  const onSliderChange = useCallback((_, value: number | number[]) => {
      if (typeof value === 'number') {
        setProgressState(prevState => ({ ...prevState, playedSeconds: value }));
        // setPlayedSeconds(value);
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


  const onVolumeClick = useCallback(() => {

    setVolume(0);
  }, []);

  const onVolumeChange = useCallback((e, value: number[] | number) => {
    if (typeof value === 'number') {
      setVolume(value);
    }

  }, []);

  const handleScreenFull = useCallback(() => {
    onScreenFull?.();

  }, [onScreenFull]);

  const handleWidthFull = useCallback(() => {
    onWidthFull?.();
  }, [onWidthFull]);


  const onPlaybackRate = useCallback((value: number) => {
    setPlaybackRate(value);
  }, []);


  const onBrs = useCallback((value: { url: string, r: number }) => {
    setPlayParameters(prevState => ({ ...prevState, ...value }));

    // @ts-ignore
    currentTime.current = player.current?.getCurrentTime();
  }, []);


  return (

    <>
      <Box
        ref={rootElRef}
        sx={{
          paddingTop: '56.25%',
          position: 'relative'
        }}
      >
        {/*<Box*/}
        {/*  onClick={onPlayClick}*/}
        {/*  sx={{*/}
        {/*    position: 'absolute',*/}
        {/*    top: 0,*/}
        {/*    left: 0,*/}
        {/*    right: 0,*/}
        {/*    bottom: 0,*/}
        {/*    zIndex: 1*/}
        {/*  }}*/}
        {/*/>*/}
        <WrapVideo
          brsConfig={brsConfig}
          playing={playing}
          playbackRate={playbackRate}
          onPlaybackRate={onPlaybackRate}
          onBrs={onBrs}
          currentBrs={playParam.r}
          isMobile={isMobile}
          onClick={onPlayClick}
        >
          {/*@ts-ignore*/}
          <ReactPlayer
            ref={player}
            onPlay={onPlay}
            onBuffer={onBuffer}
            onBufferEnd={onBufferEnd}
            onProgress={onProgress}
            onDuration={onDuration}
            playing={playing}
            muted={muted}
            volume={volume}
            playbackRate={playbackRate}
            onEnded={onEnded}
            url={playParam.url}
            width="100%"
            height="100%"
            controls={Boolean(safari)}
          />
          {
            !safari && (

              <Control
                onScreenFull={handleScreenFull}
                onWidthFull={handleWidthFull}
                onSliderChange={onSliderChange}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
                onPlayClick={onPlayClick}
                onVolumeClick={onVolumeClick}
                onVolumeChange={onVolumeChange}
                playedSeconds={playedSeconds}
                duration={duration}
                playing={playing}
                muted={muted}
                volume={volume}
                loaded={loaded}
                played={played}
                isScreenFull={isScreenFull}
              />

            )
          }


          {
            buffering ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)'
                }}
              >
                <CircularProgress />
              </Box>
            ) : null
          }

        </WrapVideo>
      </Box>

    </>
  );
}

export default React.memo(VideoPlayer);