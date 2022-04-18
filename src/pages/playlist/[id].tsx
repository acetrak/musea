// @ts-ignore
import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { alpha, Box, Chip, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Head from 'next/head';
import NextImage from 'next/image';
import SwipeableViews from 'react-swipeable-views';


import { Image, Link } from '../../components';
import { formatTime, request } from '../../utils/utils';
import Comments from '../../features/playlist/Comment';
import Songs from '../../features/playlist/Songs';


type PlaylistDetailProps = {
  detail: Detail
  auth: boolean
  playlistId: number

}

type Detail = {
  name: string,
  id: number,
  coverImgUrl: string,
  createTime: number,
  description: string,
  tags: string[],
  trackCount: number
  commentCount: number

}

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

function PlaylistDetail(props: PlaylistDetailProps) {

  const { detail, auth, playlistId } = props;

  const [tab, setTab] = useState(0);
  const deferredTab = useDeferredValue(tab);


  const theme = useTheme();


  const handleChange = async (_: any, newValue: number) => {

    setTab(newValue);
  };


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
                  <Image alt={detail.name} src={`${detail.coverImgUrl}?param=200y200`} width={200} height={200} />
                </Box>

                <Stack ml={3} sx={{ flex: 1 }}>
                  <Typography variant="h5" mb={1}>{detail.name}</Typography>
                  <Typography
                    variant="body1" color="text.secondary" className="nowrap2" gutterBottom
                  >
                    {detail.description}
                  </Typography>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" color="text.secondary">{formatTime(detail.createTime)}</Typography>
                    <Typography variant="caption" color="text.secondary">歌曲数：{detail.trackCount}</Typography>

                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {
                      detail.tags.map(o => (
                        <Chip clickable component={Link} href={`/search?keyword=${o}&tab=3`} label={o} key={o} />))
                    }
                  </Stack>
                </Stack>
              </Stack>
            </Box>

          </Container>
        </Box>
        <WallPaper>
          <NextImage
            layout="fill" alt={detail.name} src={`${detail.coverImgUrl}?param=800y312`} priority
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
          <div id="playlist_sort_j83e3" />
        </Stack>

        <SwipeableViews
          axis="x"
          index={deferredTab}
        >

          <TabPanel value={tab} index={0} dir="x">
            <Songs playlistId={playlistId} />
          </TabPanel>

          <TabPanel value={tab} index={1} dir="x">
            <Comments commentCount={detail.commentCount} playlistId={playlistId} />
          </TabPanel>

        </SwipeableViews>


      </Container>
    </>
  );
}

export default PlaylistDetail;

export async function getServerSideProps(cxt: any) {

  const { query: { id } } = cxt;

  let detail = {};

  let auth = false;

  try {
    const result = await request('/playlist/detail?id=' + id);

    if (result && result.code === 200) {
      detail = {
        name: result.playlist?.name,
        id: result.playlist?.id,
        coverImgUrl: result.playlist?.coverImgUrl,
        createTime: result.playlist?.createTime,
        description: result.playlist?.description,
        tags: result.playlist?.tags,
        trackCount: result.playlist?.trackCount,
        commentCount: result.playlist?.commentCount
      };

      auth = true;
    }


  } catch (e) {
    console.log(e);

  }

  return {
    props: {
      detail,
      auth,
      showBack: true,
      playlistId: id

    }
  };

}