// @ts-ignore
import { useCallback, useDeferredValue, useState, useMemo } from 'react';
import Head from 'next/head';
import NextImage from 'next/image';
import SwipeableViews from 'react-swipeable-views';
import { styled, useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import {
  alpha,
  Box,
  Chip,
  Container, Fade,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Typography
} from '@mui/material';
import { find } from 'lodash';

import { formatTime, request } from '../../utils/utils';
import { Image, Link } from '../../components';
import CommentsList from '../../features/CommentsList';
import { ItemRow } from '../../features/index/TopSongs';
import { PlaylistItem } from '../../store/play/reducer';
import { addPlaylist } from '../../store/play/action';
import SortMenu, { COMMENT_SORT, SORT_VALUE } from '../../components/CommentSortMenu';


const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      <Box sx={{ py: 3, m: 0.5 }}>
        {value === index ? children : null}
      </Box>
    </div>
  );
};


const WallPaper = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'background.paper',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  objectFit: 'cover'
});


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

type AlbumProps = {
  detail: {
    artists: Array<{
      name: string
      id: number
    }>
    artist: {
      alias: string[]
      albumSize: number
      id: number
      musicSize: number
      name: string
      picUrl: string
    },
    picUrl: string
    description: string
    subType: string
    name: string
    id: number
    publishTime: number
  },
  songs: Array<SongsItem>
  showBack: boolean
  albumId: number
}


function Album(props: AlbumProps) {

  const { detail, songs, albumId } = props;

  const [tab, setTab] = useState(0);
  const [total, setTotal] = useState(0);

  const [sort, setSort] = useState(() => SORT_VALUE.HOT);

  const sortType = useMemo(() => {
    const target = find(COMMENT_SORT, ['value', sort]);
    return target?.alis || 2;
  }, [sort]);

  const deferredTab = useDeferredValue(tab);

  const theme = useTheme();

  const handleChange = async (_: any, newValue: number) => {

    setTab(newValue);
  };

  const onTotal = useCallback((val: number) => {
    if (val !== total)
      setTotal(val);
  }, [total]);

  const dispatch = useDispatch();

  const play = useCallback((item: SongsItem) => {

    const row: PlaylistItem = mapItem(item);
    addPlaylist(row)(dispatch);
  }, [dispatch]);

  const onItemClick = useCallback((sort) => {

    setSort(sort);

  }, []);


  return (
    <>
      <Head>
        <title> {detail.name}</title>
      </Head>
      <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(20px)'
          }}
        >
          <Container maxWidth="lg">
            <Box py={7}>
              <Stack direction="row">
                <Box sx={{ borderRadius: 1, overflow: 'hidden', width: 200, height: 200 }}>
                  <Image alt={detail.name} src={`${detail.picUrl}?param=200y200`} width={200} height={200} />
                </Box>

                <Stack ml={3} sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="flex-end">
                    <Typography variant="h5" mb={1}>{detail.name}</Typography>
                    <Typography variant="body1" color="text.secondary" mb={1} ml={2}>{detail.subType}</Typography>
                  </Stack>

                  <Typography
                    variant="body1" color="text.secondary" className="nowrap2" gutterBottom
                  >
                    {detail.description}
                  </Typography>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">{formatTime(detail.publishTime)}</Typography>

                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {
                      detail.artists.map(o => (
                        <Chip clickable component={Link} href={`/artists/${o.id}`} label={o.name} key={o.id} />))
                    }
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Container>
        </Box>
        <WallPaper>
          <NextImage
            layout="fill" alt={detail.name} src={`${detail.picUrl}?param=800y312`} priority
          />
        </WallPaper>
      </Box>


      <Container maxWidth="lg" sx={{ mt: 6, mb: 18 }}>

        <Stack mb={4} direction="row" justifyContent="space-between" alignItems="flex-end">
          <Tabs
            value={tab}
            onChange={handleChange}
            textColor="inherit"
          >
            <Tab label="歌曲列表" sx={{ width: 100 }} />
            <Tab label="评论" sx={{ width: 100 }} />

          </Tabs>

          <Fade in={tab === 1}>
            <Stack flexDirection="row" alignItems="center">
              <Typography sx={{ fontSize: 18 }}>{total} 条评论</Typography>
              <Box ml={5}>
                <SortMenu onItemClick={onItemClick} sort={sort} />
              </Box>
            </Stack>
          </Fade>

        </Stack>

        <SwipeableViews
          axis="x"
          index={deferredTab}
        >

          <TabPanel value={tab} index={0} dir="x">

            <TableContainer component={Box} sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableBody>
                  {
                    songs.map((row) => (
                      <ItemRow showCover={false} row={row} play={play} key={row.id} />
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={1} dir="x">
            <CommentsList onTotal={onTotal} id={albumId} type="3" sortType={sortType} />
          </TabPanel>

        </SwipeableViews>


      </Container>
    </>
  );
}

export default Album;

export async function getServerSideProps(cxt: any) {

  const { query: { id } } = cxt;

  let detail = {};
  let songs = [];

  try {
    const result = await request('/album?id=' + id);

    if (result && result.code === 200) {
      detail = result.album || {};
      songs = result.songs || [];
    }


  } catch (e) {
    console.log(e);

  }

  return {
    props: {
      detail,

      showBack: true,
      albumId: id,
      songs
    }
  };

}