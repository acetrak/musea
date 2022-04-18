import type { NextPage } from 'next';
import * as React from 'react';
import Head from 'next/head';

import TopArtists from '../features/index/TopArtists';
import TopSongs from '../features/index/TopSongs';
import { request } from '../utils/utils';
import PageLayout from '../components/PageLayout';


type HomeProps = {
  artists: []
}


const Home: NextPage<HomeProps> = (props) => {

  const { artists = [] } = props;


  return (
    <>
      <Head>
        <title>Melody - 首页</title>
      </Head>

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


export async function getStaticProps() {
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
