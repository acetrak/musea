import * as React from 'react';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';

import PersonalizedCard from '../features/mv-collect/PersonalizedCard';
import { request } from '../utils/utils';

export type PersonalizedItem = {
  id: number
  name: string
  copywriter: string
  picUrl: string
  duration: number
  playCount: number
  artists: Array<{ id: number, name: string }>
  artistName: string
  artistId: number
}
type MvCollectProps = {
  personalized: PersonalizedItem[]
}


function MvCollect(props: MvCollectProps) {

  const { personalized } = props;

  console.log({ personalized });
  return (

    <>
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


      </Box>

    </>
  );
}

export default MvCollect;

export async function getStaticProps() {
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
