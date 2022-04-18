import * as React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useDispatch } from 'react-redux';

import { millisecond2Minute } from '../../utils/utils';
import { PlaylistItem } from '../../store/play/reducer';
import { addPlaylist } from '../../store/play/action';


function defaultLabelDisplayedRows({ from, to, count }: { from: number, to: number, count: number }) {
  return `${from}–${to} 共 ${count !== -1 ? `${count}首` : `超过 ${to}首`}`;
}

const mapItem = (o: SongsItem) => ({
  name: o.name,
  id: o.id,
  ar: o.ar.map(o => o.name).join(','),
  cover: '',
  dt: o.dt
});


export type SongsItem = {
  _index: number
  id: number,
  name: string
  ar: Array<{ id: number, name: string }>
  al: {
    name: string
  },
  dt: number
}


type ArtistsSongsProps = {
  songs: Array<SongsItem>
}

function ArtistsSongs(props: ArtistsSongsProps) {


  const songs: Array<SongsItem> = (props.songs || []).map((o, index) => ({ ...o, _index: index + 1 }));
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };


  const play = (item: SongsItem) => {
    const row: PlaylistItem = mapItem(item);
    addPlaylist(row)(dispatch);

  };
  return (

    <>
      <TableContainer component={Paper} sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><Typography color="grey.500">#</Typography></TableCell>
              <TableCell align="left"><Typography color="grey.500">歌曲</Typography></TableCell>
              <TableCell align="left"><Typography color="grey.500">歌手</Typography></TableCell>
              <TableCell align="left"><Typography color="grey.500">专辑</Typography></TableCell>
              <TableCell align="left"><Typography color="grey.500">时长</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              songs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <React.Fragment key={`${row.id}_${index}_`}>
                    <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => play(row)}>

                      <TableCell align="center" sx={{ width: 60 }}>
                        {row._index}
                      </TableCell>

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

      <Box py={2}>
        <TablePagination
          showFirstButton
          showLastButton
          labelRowsPerPage="每页"
          labelDisplayedRows={defaultLabelDisplayedRows}
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={songs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>

  );
}

export default React.memo(ArtistsSongs);