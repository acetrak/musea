import { Box, Button, ButtonProps, Stack, Tab, Tabs, Theme, Typography, alpha } from '@mui/material';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { get } from 'lodash';
import loadable from '@loadable/component';
import { connect } from 'react-redux';
import NextImage from 'next/image';


import { Image } from '../../components';
import { getIsMobile, request } from '../../utils/utils';
import { Dispatch } from 'redux';
import { setArtistID, setState } from '../../store/artists/action';
import { playAll } from '../../store/play/action';
import PageLayout from '../../components/PageLayout';
import { SongsItem } from '../../features/artists/ArtistsSongs';
import { PlaylistItem } from '../../store/play/reducer';
import useMediaQueryKey from '../../hooks/useMediaQueryKey';
import { useCallback } from 'react';
import MobileTabs from '../../components/MobileTabs';

const ArtistsSongsAsync = loadable(() => import(`../../features/artists/ArtistsSongs`));
const ArtistsStoryAsync = loadable(() => import(`../../features/artists/ArtistsStory`));
const ArtistsAlbumAsync = loadable(() => import(`../../features/artists/ArtistsAlbum`));
const ArtistsMVAsync = loadable(() => import(`../../features/artists/ArtistsMV`));


const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {
        value === index && (
          <Box sx={{ py: 3, m: 0.5 }}>
            {children}
          </Box>
        )
      }
    </div>
  );
};

type MobileHead = {
  detail: Detail
}
const MobileHead = (props: MobileHead) => {

  const { detail } = props;
  return (
    <>
      <Box
        sx={{
          width: '90vw',
          overflow: 'hidden',
          mx: 'auto',
          borderRadius: 10,
          position: 'relative'

        }}
      >
        <Box
          sx={{
            transform: 'scale(1)'

          }}
        >
          <NextImage
            alt={detail?.artist?.name}
            src={detail?.artist?.cover + '?param=400y400'}
            layout="responsive"
            width={300}
            height={300}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            py: 3,
            px: 2, zIndex: 30
          }}
        >
          <Typography align="center" gutterBottom variant="h5">{detail?.artist.name}</Typography>
          <Typography align="center" className="nowrap1" variant="subtitle1" gutterBottom color="text.secondary">
            {detail?.identify?.imageDesc}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          mt: '-50%',
          width: '100%',
          pt: '50%',
          position: 'relative',
          zIndex: 20,
          backgroundImage: (theme: Theme) => `linear-gradient(to top, ${theme.palette.background.default} 30%,transparent 80%)`
        }}
      >

      </Box>
    </>
  );
};

const StyledButton = (props: ButtonProps) => (
  <Button {...props} sx={{ width: 100, borderRadius: 20 }} />
);

type Detail = {
  artist: {
    cover: string
    briefDesc: string
    name: string
    id: number
  }
  identify: {
    imageDesc: string
  }
  secondaryExpertIdentiy: Array<{
    expertIdentiyId: number
    expertIdentiyName: string
    expertIdentiyCount: number
  }>
}
type ArtistsProps = {
  detail: Detail
  songs: Array<SongsItem>
  showBack: boolean
  artistId: number
  dispatch: Dispatch
}


const MAP_VALUE = {
  'songs': 0,
  'story': 1,
  'album': 2,
  'mv': 3
};

const fn = () => {
  const obj = {};
  Object.keys(MAP_VALUE).forEach(key => {
    // @ts-ignore
    const value = MAP_VALUE[key];
    // @ts-ignore
    obj[value] = key;

  });

  return obj;
};
const MAP_TAB = fn();

const Artists = (props: ArtistsProps) => {
  const { detail, artistId, dispatch, songs } = props;

  const router = useRouter();

  const tab = get(router, 'query.tab', 'songs');

  React.useEffect(() => {
    setArtistID(artistId)(dispatch);
  }, [artistId, dispatch]);

  // @ts-ignore
  const value = MAP_VALUE[tab];

  const handleChange = useCallback((_: any, newValue: number) => {


    if ([2, 3].includes(newValue))
      setState({
        rowsPerPage: 12,
        page: 0
      })(dispatch);

    setTimeout(async () => {
      // @ts-ignore
      const _tab = MAP_TAB[newValue];
      await router.push('/artists/' + artistId + '?tab=' + _tab, undefined, { shallow: true });
    }, 100);

  },[artistId, dispatch, router]);


  const onPlayAll = () => {

    if ((props.songs || [])) {

      const list: Array<PlaylistItem> = songs.map(o => ({
        cover: '',
        name: o.name,
        ar: o.ar.map(i => i.name).join(','),
        dt: o.dt,
        id: o.id
      }));
      console.log(props.songs);
      playAll(list)(dispatch);
    }

  };

  const key = useMediaQueryKey();

  const isMobile = getIsMobile(key);

  const onChangeIndex = useCallback((index: number) => {
    handleChange(null,index)

  }, [handleChange]);

  return (
    <PageLayout>
      <Head>
        <title>歌手 - {detail?.artist?.name}</title>
      </Head>

      {
        isMobile ? <MobileHead detail={detail} /> : (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', fontSize: 0 }}>
              <Image
                alt={detail?.artist?.name}
                src={detail?.artist?.cover + '?param=200y280'}
                width={200}
                height={280}
              />
            </Box>
            <Box sx={{ ml: 3, py: 2, flex: 1 }}>
              <Typography variant="h3" gutterBottom>
                {detail?.artist?.name}
              </Typography>

              <Typography className="nowrap1" variant="subtitle1" gutterBottom color="text.secondary">
                {detail?.identify?.imageDesc}
              </Typography>

              <Box
                sx={{
                  minHeight: 84
                }}
              >
                <Typography className="nowrap2" variant="subtitle1" color="grey.500">
                  {detail?.artist?.briefDesc}
                </Typography>

              </Box>
              <Stack direction="row" spacing={2} mt={4}>
                <StyledButton variant="contained" onClick={onPlayAll}>播放全部</StyledButton>

              </Stack>

            </Box>
          </Box>
        )
      }

      <Box>
        {
          isMobile ? (
            <Box py={2}>
              <MobileTabs
                textColor="#fff" value={value} onChange={handleChange} items={['歌手单曲', '歌手故事', '歌手专辑', '歌手MV']}
              />
            </Box>
          ) : (
            <Box mt={4} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                scrollButtons="auto"
              >
                <Tab label="歌手单曲" sx={{ width: 150 }} />
                <Tab label="歌手故事" sx={{ width: 150 }} />
                <Tab label="歌手专辑" sx={{ width: 150 }} />
                <Tab label="歌手MV" sx={{ width: 150 }} />
              </Tabs>
            </Box>
          )
        }


        <Box
          sx={{
            minHeight: 800,
            mb: 5
          }}
        >

          <SwipeableViews
            axis="x"
            index={value}
            onChangeIndex={onChangeIndex}
          >
            <TabPanel value={value} index={0} dir="x">
              <ArtistsSongsAsync songs={props.songs} />
            </TabPanel>

            <TabPanel value={value} index={1} dir="x">
              <ArtistsStoryAsync artistId={artistId} />
            </TabPanel>

            <TabPanel value={value} index={2} dir="x">
              <ArtistsAlbumAsync artistId={artistId} />
            </TabPanel>

            <TabPanel value={value} index={3} dir="x">
              <ArtistsMVAsync artistId={artistId} />
            </TabPanel>
          </SwipeableViews>
        </Box>

      </Box>
    </PageLayout>
  );
};


export default connect()(Artists);


export async function getServerSideProps(cxt: any) {

  const { query: { id } } = cxt;

  let detail = {};
  let songs = [];
  try {
    const result = await request('/artist/detail?id=' + id);
    const resultSongs = await request('/artist/songs?id=' + id);

    if (result && result.code === 200) {
      detail = result.data || {};
    }

    if (resultSongs && resultSongs.code === 200) {
      songs = resultSongs.songs || [];
    }

  } catch (e) {
    console.log(e);

  }

  return {
    props: {
      detail,
      songs,
      showBack: true,
      artistId: id
    }
  };

}


