import * as React from 'react';
import useSWR from 'swr';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Theme,
  Typography
} from '@mui/material';

import Error from './Error';
import Loading from './Loading';
import { fetcher, millisecond2Minute } from '../../utils/utils';
import { PlaylistItem } from '../../store/play/reducer';
import { addPlaylist } from '../../store/play/action';
import { defaultLabelDisplayedRows } from '../artists/ArtistsAlbum';
import ResultTip from './ResultTip';

type SongsProps = {
  input?: string
  tabValue?: number
}

const TYPE = 1;

type SongsItem = {
  _index: number
  id: number,
  name: string
  ar: Array<{ id: number, name: string }>
  al: {
    name: string
    picUrl: string
  },
  dt: number
}

const mapItem = (o: SongsItem) => ({
  name: o.name,
  id: o.id,
  ar: o.ar.map(o => o.name).join(','),
  cover: o.al.picUrl,
  dt: o.dt
});

const Songs = (props: SongsProps) => {

  const { input } = props;
  const { data, error } = useSWR(input ? () => `/cloudsearch?keywords=${input}&type=${TYPE}&limit=100` : null, fetcher);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);

  const dispatch = useDispatch();

  const songs: Array<SongsItem> = get(data, 'result.songs', []);

  const page_songs: Array<SongsItem> = React.useMemo(() => songs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [
    songs, page, rowsPerPage
  ]);

  console.log('Songs', );


  const play = (item: SongsItem) => {
    const row: PlaylistItem = mapItem(item);
    addPlaylist(row)(dispatch);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };


  const loading = Boolean(!error && !data && input);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
        <Table>
          <TableBody>
            {
              page_songs.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:nth-of-type(odd)': {
                        backgroundColor: (theme: Theme) => theme.palette.mode === 'dark' ? '#181818' : '#fff'
                      },
                      '& td, & th': {
                        border: 0
                      }

                    }}
                    onClick={() => play(row)}
                  >

                    <TableCell align="left">
                      <Typography>
                        {row?.name}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography className="nowrap1" sx={{ maxWidth: 400 }} color="grey.500" fontSize={14}>
                        {row?.ar.map(o => o.name).join(' , ')}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography>《 {row.al.name} 》</Typography>
                    </TableCell>
                    <TableCell
                      align="left" sx={{ width: 200 }}
                    ><Typography color="grey.500">{millisecond2Minute(row.dt)}</Typography></TableCell>

                  </TableRow>
                </React.Fragment>
              ))
            }

          </TableBody>
        </Table>
      </TableContainer>

      <ResultTip loading={loading} hasData={!!songs.length} error={error} />
      {
        songs.length ? (
          <Box py={2}>
            <TablePagination
              showFirstButton
              showLastButton
              labelRowsPerPage="每页"
              labelDisplayedRows={defaultLabelDisplayedRows}
              rowsPerPageOptions={[12, 30, 60]}
              component="div"
              count={songs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        ) : null
      }


    </>
  );

};


export default React.memo(Songs);