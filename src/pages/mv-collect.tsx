import * as React from 'react';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';
import Head from 'next/head';

import PersonalizedCard,{MvItem} from '../features/mv-collect/PersonalizedCard';
import MvTop from '../features/mv-collect/MvTop';
import { request } from '../utils/utils';
import { appName } from '../constant';


type MvCollectProps = {
  personalized: MvItem[]
}


function MvCollect(props: MvCollectProps) {

  const { personalized } = props;

  console.log({ personalized });
  return (

    <>
      <Head>
        <title>{appName} - MV</title>
      </Head>



      <Box
        sx={{
          px: 5,
          pt: 5
        }}
      >

        <Typography variant="h6">最新热门MV推荐</Typography>

        <ImageList cols={4} gap={30}>
          {personalized.map((item) => (
            <ImageListItem key={item.id}>
              <PersonalizedCard mv={item} />
            </ImageListItem>
          ))}
        </ImageList>

      <Box pt={3} pb={10}>
        <MvTop/>
      </Box>


      </Box>

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
      personalized
    }
  };
}
