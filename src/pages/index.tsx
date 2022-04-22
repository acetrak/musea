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

      <TopArtists artists={artists} />


      <PageLayout sx={{pt:0}}>
        <TopSongs />

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
