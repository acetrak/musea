import * as React from 'react';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';
import Head from 'next/head';

import PageLayout from '../components/PageLayout';
import PersonalizedCard, { MvItem } from '../features/mv-collect/PersonalizedCard';
import MvTop from '../features/mv-collect/MvTop';
import Exclusive from '../features/mv-collect/Exclusive';
import { request } from '../utils/utils';
import { appName } from '../constant';
import SearchMVInput from '../components/SearchMVInput';


type MvCollectProps = {
  personalized: MvItem[]
}


function MvCollect(props: MvCollectProps) {

  const { personalized } = props;

  return (

    <>
      <Head>
        <title>{appName} - MV</title>
      </Head>

      <PageLayout sx={{pt:3}}>
        <Box>

          <SearchMVInput />

          <Typography variant="h6">最新热门</Typography>

          <ImageList cols={4} gap={30}>
            {
              personalized.map((item) => (
                <ImageListItem key={item.id}>
                  <PersonalizedCard mv={item} />
                </ImageListItem>
              ))
            }
          </ImageList>

          <Box pt={3}>
            <MvTop />
          </Box>

          <Box pt={3} pb={10}>
            <Exclusive />
          </Box>

        </Box>
      </PageLayout>
    </>
  );
}

export default MvCollect;

export async function getServerSideProps() {
  let personalized = [];
  try {
    const result = await request('/personalized/mv');

    if (result && result.code === 200) {
      personalized = result.result;
    }
  } catch (e) {
    console.log(e);

  }

  return {
    props: {
      personalized,
      hideAudio: true
    }
  };
}
