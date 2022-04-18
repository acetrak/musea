import * as React from 'react';
import { useCallback, useEffect, useMemo, useState, useImperativeHandle } from 'react';
import {
  alpha,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText, Paper,
  Stack,
  Theme,
  Typography
} from '@mui/material';
import useSWR from 'swr';
import { debounce, get, isEmpty, trim } from 'lodash';
import { animated, useSpring, config } from '@react-spring/web';
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';

import AlbumIcon from '@mui/icons-material/Album';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonOutline from '@mui/icons-material/PersonOutline';

import { addPlaylist } from '../../store/play/action';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { Link } from '../../components';


type SuggestWordProps = {
  url?: string | null
  input: string
}


type artistProps = {
  id: number
  name: string
}
type AlbumsItem = {
  id: number
  name: string
  artist?: artistProps,
  artists?: artistProps[]
}
type ArtistsItem = {
  id: number
  name: string
}
type SongsItem = {
  id: number
  name: string
  transNames: string[]
  alias?: string[]
  dt: number,
  artist?: artistProps,
  artists?: artistProps[]
}
type MvsItem = {}
type PlaylistItem = {
  id: number,
  name: string
}

const getArtists = ({ artist, artists }: { artist?: artistProps, artists?: artistProps[] }) => {
  if (artists) return artists.map(o => o.name).join(',');
  else if (artist) return artist.name;
  return '';
};

const Title = ({ title }: { title: string }) => <Typography variant="body1" color="text.secondary">{title}</Typography>;
// const Title = ({ title }: { title: string }) => <Typography variant="body1" color="text.secondary">{title}</Typography>;

const Albums = (props: { data: Array<AlbumsItem> }) => {

  const { data } = props;
  return (
    <Box>

      <List
        sx={{ width: '100%' }}
        aria-label="专辑"
      >
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AlbumIcon sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText primary={<Title title="专辑" />} />
          </ListItemButton>
        </ListItem>
        {
          data.map(o => (
            <ListItem disablePadding key={o.id}>
              <ListItemButton component={Link} href={`/album/[id]`} linkAs={`/album/${o.id}`}>
                <ListItemText
                  sx={{ pl: '40px' }} primary={o.name + ' - ' + getArtists({ artist: o.artist, artists: o.artists })}
                />
              </ListItemButton>
            </ListItem>
          ))
        }

      </List>

    </Box>
  );
};

const Artists = (props: { data: Array<ArtistsItem> }) => {
  const { data } = props;
  return (
    <Box>
      <List
        sx={{ width: '100%' }}
        aria-label="艺术家"
      >
        <ListItem disablePadding>
          <Stack direction="row" alignItems="center" p={1.5}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PersonOutline sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText primary={<Title title="艺术家" />} />
          </Stack>
        </ListItem>
        {
          data.map(o => (
            <ListItem disablePadding key={o.id}>
              <ListItemButton component={Link} href={`/artists/[id]`} linkAs={`/artists/${o.id}?tab=songs`}>
                <ListItemText sx={{ pl: '40px' }} primary={o.name} />
              </ListItemButton>
            </ListItem>
          ))
        }

      </List>
    </Box>
  );
};


const getSongsInfo = (o: SongsItem) => {
  return {
    alias: Array.isArray(o.alias) && o.alias.length ? o.alias.join(',') : '',
    transNames: Array.isArray(o.transNames) && o.transNames.length ? o.transNames.join(',') : ''
  };
};

const Songs = (props: { data: Array<SongsItem>, dispatch: Dispatch }) => {
  const { data, dispatch } = props;

  const onClick = useCallback((item: SongsItem) => {

    addPlaylist({
      ar: getArtists({ artist: item.artist, artists: item.artists }),
      cover: '',
      dt: item.dt,
      id: item.id,
      name: item.name
    })(dispatch);

  }, [dispatch]);

  return (
    <Box>
      <List
        sx={{ width: '100%' }}
        aria-label="单曲"
      >
        <ListItem disablePadding>
          <Stack direction="row" alignItems="center" p={1.5}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <MusicNoteIcon sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText
              primary={<Title title="单曲" />}
            />
          </Stack>
        </ListItem>
        {
          data.map(o => {

            const { alias, transNames } = getSongsInfo(o);
            return (
              <ListItem disablePadding key={o.id}>
                <ListItemButton onClick={() => onClick(o)}>
                  <ListItemText
                    sx={{ pl: '40px' }}
                    primary={
                      <Stack flexDirection="row" alignItems="center">
                        <Typography variant="body1">{o.name}</Typography>
                        {
                          alias && (
                            <Typography
                              variant="body1" sx={{ fontSize: 13, mx: 0.3 }} color="grey.400"
                            >
                              ({alias})
                            </Typography>
                          )
                        }
                        {
                          transNames && (
                            <Typography variant="body1" sx={{ fontSize: 13 }}> - {transNames}</Typography>
                          )
                        }
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        }

      </List>
    </Box>
  );
};
const Mvs = (props: { data: Array<MvsItem> }) => {
  const { data } = props;
  return (
    <Box>
      <List
        sx={{ width: '100%' }}
        aria-label="Mv"
      >
        <ListItem disablePadding>
          <Stack direction="row" alignItems="center" p={1.5}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VideocamIcon />
            </ListItemIcon>
            <ListItemText primary={<Title title="Mv" />} />
          </Stack>
        </ListItem>


      </List>
    </Box>
  );
};

const Playlist = (props: { data: Array<PlaylistItem>, }) => {
  const { data } = props;

  return (
    <Box>

      <List
        sx={{ width: '100%' }}
        aria-label="歌单"
      >
        <ListItem disablePadding>
          <Stack direction="row" alignItems="center" p={1.5}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <QueueMusicRoundedIcon sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText primary={<Title title="歌单" />} />
          </Stack>
        </ListItem>
        {
          data.map(o => (
            <ListItem disablePadding key={o.id}>
              <ListItemButton component={Link} href={`/playlist/[id]`} linkAs={`/playlist/${o.id}`}>
                <ListItemText
                  sx={{ pl: '40px' }} primary={o.name}
                />
              </ListItemButton>
            </ListItem>
          ))
        }

      </List>

    </Box>
  );
};

function useSuggest({ input }: { input: string }) {
  const [keyword, setKeyword] = useState('');

  const de = useMemo(() => {
    return debounce((value: string) => {
      setKeyword(trim(value));
    }, 1000);
  }, []);

  useEffect(() => {
    de(input);
  }, [de, input]);

  const { data, error } = useSWR(keyword ? () => `/search/suggest?keywords=${keyword}` : null);

  return {
    data,
    error,
    keyword
  };
}

export type SuggestWordRef = {
  hide: () => void
  show: () => void
}

function SuggestWord(props: SuggestWordProps, ref: React.ForwardedRef<SuggestWordRef>) {
  const { input } = props;


  const { data, error, keyword } = useSuggest({ input });

  const loading = Boolean(!error && !data);

  const resultIsEmpty = isEmpty(get(data, 'result', {}));

  const albums = get(data, 'result.albums', []);
  const artists = get(data, 'result.artists', []);
  const songs = get(data, 'result.songs', []);
  const mvs = get(data, 'result.mvs', []);
  const playlist = get(data, 'result.playlists', []);
  const order: string[] = get(data, 'result.order', []);

  const dispatch = useDispatch();

  const getResult = useCallback((key: string) => {

    switch (key) {
      case 'songs':
        return <Songs data={songs} key="songs" dispatch={dispatch} />;
      case 'artists':
        return <Artists data={artists} key="artists" />;
      case 'albums':
        return <Albums data={albums} key="albums" />;
      case 'mvs':
        return <Mvs data={mvs} key="mvs" />;
      case 'playlists':
        return <Playlist data={playlist} key="playlist" />;
      default:
        return null;
    }

  }, [albums, artists, dispatch, mvs, playlist, songs]);


  const dom = useMemo(() => order.map(item => getResult(item)), [getResult, order]);


  return (
    <Paper
      sx={{
        overflowY: 'auto',
        maxHeight: 560,
        minHeight: 110
        // bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.5),
        // backdropFilter: 'blur(20px)'
      }}

    >
      <Box p={2}>
        {
          loading && keyword && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 2 }}>
              <CircularProgress size={24} />
            </Stack>

          )
        }

        {
          resultIsEmpty && keyword && !loading && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 2 }}>
              <Typography variant="body1" my={1} color="grey.500">无搜索建议</Typography>
            </Stack>
          )
        }

        {dom}
      </Box>
    </Paper>
  );
}

export default React.forwardRef(SuggestWord);