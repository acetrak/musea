import * as React from 'react';
import { alpha, Box, Button, Divider, Paper, Slide, Stack, TableRowProps, Theme, Typography } from '@mui/material';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { connect } from 'react-redux';

import { State } from '../../store';
import { millisecond2Minute } from '../../utils/utils';
import { addPlaylist, clearPlayList } from '../../store/play/action';
import { PlaylistItem } from '../../store/play/reducer';


const StyledTableRow = ({
                          sx,
                          current,
                          item,
                          ...reset
                        }: TableRowProps & { current: number | undefined, item: any }) => (
  <TableRow
    {...reset}
    sx={{

      '& p, span': {
        color: (theme: Theme) => current === item?.id ? theme.palette.primary.main : theme.palette.text.secondary
      },
      backgroundColor: (theme: Theme) => alpha(theme.palette.action.hover, 0.05),
      // '&:nth-of-type(odd)': {
      //   backgroundColor: alpha(theme.palette.action.hover, 0.05)
      // },

      '&:last-child td, &:last-child th': {
        border: 0
      },
      '&:hover': {
        boxShadow: (theme: Theme) => theme.shadows[1],
        backgroundColor: (theme: Theme) => theme.palette.action.hover,
        cursor: 'pointer',
        '& p , span': {
          color: (theme: Theme) => current === item?.id ? theme.palette.primary.main : theme.palette.text.secondary
        }
      },
      ...sx
    }}
  />
);
type PlaylistProps = {}

function Playlist(props: PlaylistProps) {

  // @ts-ignore
  const { show, playlist, dispatch, currentPlay } = props;

  // @ts-ignore
  const { id } = { ...currentPlay };

  const play = (row: any) => {

    addPlaylist(row)(dispatch);

  };
  const onClear = () => {

    clearPlayList()(dispatch);

  };

  return (
    <Slide in={show} direction="left">

      <Paper

        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          bottom: 20 + 64,
          width: 500,
          // backdropFilter: 'blur(20px)',
          zIndex: 1200,
          borderRadius: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >

        <Typography variant="h6" gutterBottom>
          当前播放
        </Typography>

        {
          playlist.length ? (
            <Stack sx={{ mb: 1 }} flexDirection="row" alignItems="center" justifyContent="space-between">
              <Typography color="text.secondary">
                共{playlist.length}首
              </Typography>

              <Button onClick={onClear}>清除所有</Button>
            </Stack>
          ) : null
        }

        <Divider />

        <Box
          className="no-scrollbar"
          sx={{
            flex: 1,
            overflowY: 'auto'
          }}
        >


          <TableContainer sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
            <Table>

              <TableBody>
                {
                  playlist
                    .map((row: PlaylistItem, index: number) => (
                      <React.Fragment key={`${row.id}_${index}`}>
                        <StyledTableRow current={id} item={row} onClick={() => play(row)}>

                          <TableCell align="left">
                            <Typography className="nowrap1" color="text.secondary" sx={{ maxWidth: 200 }}>
                              {row?.name}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">
                            <Typography className="nowrap1" color="text.secondary" fontSize={14}>
                              {row?.ar}
                            </Typography>
                          </TableCell>


                          <TableCell
                            align="right"
                          >
                            <Typography color="text.secondary">{millisecond2Minute(row.dt)}</Typography>
                          </TableCell>

                        </StyledTableRow>
                      </React.Fragment>
                    ))
                }

              </TableBody>
            </Table>
          </TableContainer>


        </Box>
      </Paper>
    </Slide>
  );

}

const mapStateToProps = (state: State) => {
  return {
    show: state.play.showPlaylist,
    playlist: state.play.playlist,
    currentPlay: state.play.currentPlay
  };
};

const Pl = connect(mapStateToProps)(Playlist);
export default React.memo(Pl);