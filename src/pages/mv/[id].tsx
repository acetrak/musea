import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Container, Divider, Grid, Portal, Stack, Typography } from '@mui/material';
import useSWR from 'swr';
import Head from 'next/head';
import loadable from '@loadable/component';

import { fetcher, request } from '../../utils/utils';
import VideoPlayer from '../../components/VideoPlayer';
import Comment from '../../features/mv/Comment';
import PageLayout from '../../components/PageLayout';
import SimiList from '../../features/mv/SimiList';

const TextOverflow = loadable(() => import('../../features/mv/TextOverflow'));

const ROW1 = 9;
const ROW2 = 3;

type MvProps = {
  detail: {
    name: string
    playCount: number
    publishTime: string
    desc: string
    id: number
    duration: number
    artistId: number
    cover: string
    artistName: string
    briefDesc: string
    artists: Array<{ id: number, name: string, }>
    brs: Array<{ size: number, br: number, }>
  }
  showBack: boolean
  mvId: number
  url: string
  urlBrs: number
}

const getUrlAndBrs = (result: any, p: number): undefined | { url: string, r: number } => {
  if (result && result.code === 200) {
    const { data } = result;
    if (data?.r === p)
      return {
        url: data?.url,
        r: data?.r
      };
  }
};

const fullScreenStyles = {
  height: '100vh',
  overflowY: 'auto'
};

function Mv(props: MvProps) {

  const { detail, mvId, url, urlBrs } = props;

  const thisPageRootRef = useRef<HTMLDivElement>(null);
  const screenFullRef = useRef(null);

  const [isWidthFull, setWidthFull] = useState(false);
  const [isScreenFull, setScreenFull] = useState(false);

  const publishTime = useMemo(() => {
    const arr = (detail?.publishTime || '').split('-');
    return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
  }, [detail.publishTime]);


  const { data: data_r_1080 } = useSWR(urlBrs === 1080 ? null : () => `/mv/url?id=${mvId}&r=1080`, fetcher);
  const { data: data_r_720 } = useSWR(urlBrs === 720 ? null : () => `/mv/url?id=${mvId}&r=720`, fetcher);
  const { data: data_r_480 } = useSWR(urlBrs === 480 ? null : () => `/mv/url?id=${mvId}&r=480`, fetcher);
  const { data: data_r_240 } = useSWR(urlBrs === 240 ? null : () => `/mv/url?id=${mvId}&r=240`, fetcher);

  const p1080: undefined | { url: string, r: number } = useMemo(() => getUrlAndBrs(data_r_1080, 1080), [data_r_1080]);
  const p720: undefined | { url: string, r: number } = useMemo(() => getUrlAndBrs(data_r_720, 720), [data_r_720]);
  const p480: undefined | { url: string, r: number } = useMemo(() => getUrlAndBrs(data_r_480, 480), [data_r_480]);
  const p240: undefined | { url: string, r: number } = useMemo(() => getUrlAndBrs(data_r_240, 240), [data_r_240]);
// @ts-ignore
  const brsConfig: Array<{ url: string; r: number }> = useMemo(() => {
    // @ts-ignore
    return [p1080, p720, p480, p240, { url, r: urlBrs }].filter(o => !!o).sort((a, b) => b.r - a.r);
  }, [p1080, p720, p480, p240, url, urlBrs]);


  const onScreenFullChange = useCallback((val: any) => {

    if (screenFullRef.current) {
      // @ts-ignore
      const isFull = screenFullRef.current.isFullscreen;
      setScreenFull(isFull);
      setWidthFull(isFull);
    }

  }, []);

  useEffect(() => {
    if (!screenFullRef.current) {
      // @ts-ignore
      import('screenfull').then((res) => {
        // @ts-ignore
        screenFullRef.current = res.default;
        // @ts-ignore
        screenFullRef.current.on('change', onScreenFullChange);
        console.log(screenFullRef.current);
      }).catch((e) => {
        console.log(e);
      });

    }

    return () => {
      if (screenFullRef.current) {
        // @ts-ignore
        screenFullRef.current.off('change', onScreenFullChange);
        screenFullRef.current = null;
      }
    };

  }, [onScreenFullChange]);

  const ar = detail.artists.map(o => o.name).join(',');

  const onWidthFull = useCallback(() => {
    setWidthFull(prevState => !prevState);
  }, []);

  const onScreenFull = useCallback(() => {
    if (screenFullRef.current) {
      // @ts-ignore
      screenFullRef.current.toggle(thisPageRootRef.current);

      thisPageRootRef.current?.scrollTo({ top: 0 });
    }
  }, []);


  return (
    <PageLayout>
      <Head>
        <title>{detail.name} - {ar}</title>
      </Head>

      <Box
        ref={thisPageRootRef}
        sx={{
          mb: 10,
          ...(isScreenFull && fullScreenStyles)
        }}
        className="no-scrollbar"

      >
        <Grid container spacing={4}>
          <Grid item md={isWidthFull ? 12 : ROW1} lg={isWidthFull ? 12 : ROW1} sm={12}>

            <VideoPlayer
              isScreenFull={isScreenFull}
              onScreenFull={onScreenFull}
              onWidthFull={onWidthFull}
              src={url}
              urlBrs={urlBrs}
              brsConfig={brsConfig}
            />

            <Container maxWidth={false} sx={{ padding: isScreenFull ? ' 0 60px' : 'unset' }} disableGutters>

              <Typography pt={3} variant="h5">{detail.name}</Typography>

              <Stack flexDirection="row" alignItems="center" mb={2}>
                <Typography
                  sx={{
                    '&::after': {
                      content: `'•'`,
                      mx: 0.5
                    }
                  }} className="nowrap2" variant="body2" color="text.secondary"
                >
                  {detail.playCount}次观看
                </Typography>

                <Typography className="nowrap2" variant="body2" color="text.secondary">
                  {publishTime}
                </Typography>
              </Stack>

              <Divider />

              <Box py={2}>
                <Typography
                  variant="body1" sx={{ fontSize: 17, mb: 1 }}
                >
                  {ar}
                </Typography>

                {
                  detail.desc && (
                    <TextOverflow mvId={mvId}>
                      <Typography
                        sx={{ lineHeight: 1.9 }} variant="body1" color="text.secondary"
                      >{detail.desc}</Typography>
                    </TextOverflow>
                  )
                }

              </Box>

              <Divider />


              <Grid container spacing={isWidthFull ? 10 : 0}>
                <Grid item md={isWidthFull ? ROW1 - 1 : 12} lg={isWidthFull ? ROW1 - 1 : 12} sm={12}>
                  <Comment mvId={mvId} />
                </Grid>
                <Grid item md={isWidthFull ? ROW2 + 1 : 0} lg={isWidthFull ? ROW2 + 1 : 0} sm={isWidthFull ? 12 : 0}>
                  <div id="backup_simi_place_u83jdc9"></div>
                </Grid>
              </Grid>
            </Container>

          </Grid>
          <Grid item md={isWidthFull ? 0 : ROW2} lg={isWidthFull ? 0 : ROW2} sm={isWidthFull ? 0 : 12}>
            <Portal
              disablePortal={!isWidthFull} container={() => document?.querySelector('#backup_simi_place_u83jdc9')}
            >
              <Box
                sx={{
                  mt: isWidthFull ? 5 : 0,
                  minHeight: 300,
                  display: { xs: 'none', md: 'none', lg: 'block' }
                }}
              >
                <SimiList mvId={mvId} />
              </Box>
            </Portal>

          </Grid>
        </Grid>


      </Box>

      {/*<ScreenFull ref={screenFullRef} />*/}
    </PageLayout>
  );
}

export default Mv;

export async function getServerSideProps(cxt: any) {

  const { query: { id } } = cxt;

  let detail = {};

  let url = '';
  let r = '';

  try {
    const result = await request('/mv/detail?mvid=' + id);
    const result2 = await request(`/mv/url?id=${id}&r=720`);

    if (result && result.code === 200) {
      detail = result.data || {};

    }
    if (result2 && result2.code === 200) {
      url = result2.data?.url || '';
      r = result2.data?.r || '';

    }

  } catch (e) {
    console.log(e);

  }

  return {
    props: {
      detail,
      showBack: true,
      mvId: id,
      url,
      urlBrs: r,
      hideAudio: true,
      isMiniWidth: true
    }
  };

}