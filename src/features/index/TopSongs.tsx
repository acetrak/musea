import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Skeleton, Stack, Tab, TableRowProps, Tabs, Theme, Typography } from '@mui/material';
import useSWR from 'swr';
import { get } from 'lodash';

import { fetcher, millisecond2Minute } from '../../utils/utils';
import { Image } from '../../components';
import { PlaylistItem } from '../../store/play/reducer';
import { useDispatch } from 'react-redux';
import { addPlaylist, playAll } from '../../store/play/action';
// import {PlaylistItem} from '../../store/play/action';


type TracksItem = {
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}


export const StyledTableRow = ({ sx, ...reset }: TableRowProps) => (
  <TableRow
    {...reset}
    sx={{
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      backgroundColor: (theme: Theme) => theme.palette.background.paper,
      // '&:nth-of-type(odd)': {
      //   backgroundColor: theme.palette.action.hover
      // },

      '&:last-child td, &:last-child th': {
        border: 0
      },
      '&:hover': {
        boxShadow: (theme: Theme) => theme.shadows[1],
        backgroundColor: (theme: Theme) => theme.palette.action.hover,
        transform: 'scale(1.01)',
        cursor: 'pointer'
      },
      ...sx
    }}
  />
);


type ItemRowProps = {
  row: TracksItem,
  play: (row: TracksItem) => void,
  index?: number
  showCover?: boolean
}
export const ItemRow = React.memo((props: ItemRowProps) => {

  const { row, play, index, showCover = true } = props;

  return (

    <>

      {
        row._fake ? (
          <>
            <TableRow sx={{ '& td, & th': { border: 0 } }}>
              <TableCell sx={{ width: 80 }}>
                <Skeleton
                  className="songCover" animation="wave" variant="rectangular" width={40}
                  height={40}
                />
              </TableCell>
              <TableCell sx={{ width: 246 }}>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell
                align="center" sx={{ width: 246 }}
              >
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell align="center">
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" variant="text" />
              </TableCell>
            </TableRow>
            <tr style={{ height: 8, display: 'block' }} />

          </>
        ) : (

          <>

            <StyledTableRow
              onClick={() => play(row)}
              sx={{
                '& td, & th': {
                  border: 0
                }
              }}
            >
              {
                typeof index === 'number' ? (
                  <TableCell sx={{ width: 'unset' }} align="center">
                    <Typography variant="body2" color="text.secondary"> #&nbsp;{index + 1}</Typography>
                  </TableCell>
                ) : null
              }

              {
                showCover ? (
                  <TableCell sx={{ width: 80 }}>
                    <Image
                      alt={row?.al?.name}
                      className="songCover"
                      src={row?.al?.picUrl + '?param=40y40'}
                      width={40}
                      height={40}
                    />
                  </TableCell>
                ) : <div style={{ height: 52 }} />
              }

              <TableCell sx={{ width: 320 }}>
                <Typography className="nowrap2">
                  {row?.name}
                </Typography>

              </TableCell>
              <TableCell
                align="left" sx={{ width: 300 }}
              >
                <Typography className="nowrap1" color="grey.500" fontSize={14}>
                  {row?.ar.map(o => o.name).join(',')}
                </Typography>
              </TableCell>
              <TableCell align="left"><Typography>《 {row.al.name} 》</Typography></TableCell>
              <TableCell align="center"><Typography
                sx={{ minWidth: 160 }}
              >{millisecond2Minute(row.dt)}</Typography></TableCell>


            </StyledTableRow>
            <tr style={{ height: 8, display: 'block' }} />
          </>
        )
      }


    </>
  );
});
ItemRow.displayName = 'ItemRow';

type TimeTabsProps = {
  onChange: (event: any, value: number) => void
  value: number
}

function TimeTabs(props: TimeTabsProps) {
  const { onChange, value } = props;
  return (

    <Tabs value={value} onChange={onChange}>
      <Tab label="一天内" {...a11yProps(0)} value={19723756} />
      <Tab label="一周内" {...a11yProps(1)} value={3779629} />
      <Tab label="一个月内" {...a11yProps(2)} value={3778678} />
    </Tabs>

  );


}

const TabsTime = React.memo(TimeTabs);

const mapItem = (o: TracksItem) => ({
  name: o.name,
  id: o.id,
  ar: o.ar.map(o => o.name).join(','),
  cover: o.al.picUrl,
  dt: o.dt
});

function TopSongs() {


  const [value, setValue] = React.useState(19723756);

  const dispatch = useDispatch();

  const { data } = useSWR('/playlist/detail?id=' + value, fetcher);

  const tracks: Array<TracksItem> = get(data, 'playlist.tracks', []).slice(0, 15);

  // @ts-ignore
  const var_tracks: Array<TracksItem> = React.useMemo(() => {
    if (!data) return Array.from({ length: 6 }).map((_, index) => ({
      id: index,
      _fake: true
    }));
    else return tracks;
  }, [data, tracks]);


  const handleChange = (event: any, newValue: any) => {
    if (newValue !== value)
      setValue(newValue);
  };


  const play = (item: TracksItem) => {

    const row: PlaylistItem = mapItem(item);
    addPlaylist(row)(dispatch);

  };

  const onPlayAll = () => {
    if (data) {
      const p = tracks.map(o => mapItem(o));
      playAll(p)(dispatch);
    }

  };

  console.log('render Topsongs');

  return (
    <>

      <Stack sx={{ mb: 4, mt: 6 }} alignItems="center" flexDirection="row" justifyContent="flex-start">
        <Typography sx={{ mr: 3 }} variant="h6">最受欢迎</Typography>

        <TabsTime value={value} onChange={handleChange} />

        <Button
          onClick={onPlayAll}
          disabled={!data}
          size="small"
          sx={{ borderRadius: 10, marginLeft: 'auto' }}
          variant="contained"
        >
          播放全部
        </Button>

      </Stack>

      <TableContainer
        component={Box} sx={{ overflowX: 'hidden', overflowY: 'auto' }}
      >
        <Table size="small" stickyHeader>
          <TableBody>
            {
              var_tracks.map((row, index: number) => (
                <ItemRow index={index} row={row} play={play} key={`${row.id}`} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

    </>
  );
}

export default React.memo(TopSongs);