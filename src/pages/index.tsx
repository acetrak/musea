import type { NextPage } from 'next';
import * as React from 'react';
import Head from 'next/head';

import TopArtists from '../features/index/TopArtists';
import TopSongs from '../features/index/TopSongs';
import { request } from '../utils/utils';
import PageLayout from '../components/PageLayout';
import { appName } from '../constant';


type HomeProps = {
  artists: []
}


const Home: NextPage<HomeProps> = (props) => {

  const { artists = [] } = props;


  return (
    <>
      <Head>
        <title>{appName}- 首页</title>
      </Head>

      {/*<Stack>*/}
      {/*  <Typography variant="h5">h5: 你好，哈哈哈1234567</Typography>*/}
      {/*  <Typography variant="h6">h6: 你好，哈哈哈1234567</Typography>*/}
      {/*  <Typography variant="subtitle1">subtitle1: 你好，哈哈哈1234567</Typography>*/}
      {/*  <Typography variant="subtitle2">subtitle2: 你好，哈哈哈1234567</Typography>*/}
      {/*  <Typography variant="body1">body1: 你好，哈哈哈1234567</Typography>*/}
      {/*  <Typography variant="body2">body2: 你好，哈哈哈1234567</Typography>*/}
      {/*  <Typography variant="caption">caption: 你好，哈哈哈1234567</Typography>*/}
      {/*</Stack>*/}

      <PageLayout>
        <div style={{ marginBottom: 100 }}>
          <TopArtists artists={artists} />
          <TopSongs />
        </div>
      </PageLayout>
    </>

  );
};

export default Home;


export async function getServerSideProps() {
  let artists = [];
  try {
    const result = await request('/top/artists');

    if (result && result.code === 200) {
      artists = result.artists;
    }
  } catch (e) {
    console.log(e);

  }

  return {
    props: {
      artists
    }
  };
}
