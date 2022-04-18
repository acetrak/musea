import { useMemo, useState, memo, useCallback } from 'react';
import useSWR from 'swr';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Box, Table, TableBody, TableContainer, Typography } from '@mui/material';


import { PlaylistItem } from '../../store/play/reducer';
import { addPlaylist } from '../../store/play/action';
import { ItemRow } from '../index/TopSongs';


const LIMIT = 50;

type PlaylistSongsProps = {
  playlistId: number
}
type SongsItem = {
  id: number
  name: string,
  al: {
    name: string
    picUrl: string
  },
  dt: number
  pop: number
  ar: Array<{ id: number, name: string }>
  _fake?: boolean | undefined
}

const mapItem = (o: SongsItem) => ({
  name: o.name,
  id: o.id,
  ar: o.ar.map(o => o.name).join(','),
  cover: o.al.picUrl,
  dt: o.dt
});


function PlaylistSongs(props: PlaylistSongsProps) {
  const { playlistId } = props;
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * LIMIT, [page]);

  const {
    data,
    error
  } = useSWR(() => `/playlist/track/all?id=${playlistId}&limit=${LIMIT}&offset=${offset}`);

  const loading = Boolean(!data && !error);

  const songs: SongsItem[] = get(data, 'songs', []);

  // @ts-ignore
  const var_songs: Array<SongsItem> = useMemo(() => {
    if (loading) return Array.from({ length: 6 }).map((_, index) => ({
      id: index,
      _fake: true
    }));
    else return songs;
  }, [loading, songs]);


  const dispatch = useDispatch();

  const play = useCallback((item: SongsItem) => {

    const row: PlaylistItem = mapItem(item);
    addPlaylist(row)(dispatch);
  }, [dispatch]);


  // const handlePageChange = useCallback((e: any, page: number) => {
  //
  //   setPage(page);
  //
  // }, []);

  return (

    <>
      <TableContainer component={Box} sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableBody>
            {
              var_songs.map((row, index: number) => (
                <ItemRow index={index + offset} row={row} play={play} key={row.id} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      {/*<Stack direction="row" justifyContent="flex-end" sx={{ py: 6 }}>*/}
      {/*  <Pagination*/}
      {/*    count={Math.ceil((detail.trackCount || 0) / LIMIT)} onChange={handlePageChange} variant="outlined"*/}
      {/*  />*/}
      {/*</Stack>*/}
      {
        !loading && (
          <Box py={3}>
            <Typography variant="caption" color="text.secondary">注：只显示前{LIMIT}条</Typography>
          </Box>
        )
      }

    </>
  );
}

export default memo(PlaylistSongs);