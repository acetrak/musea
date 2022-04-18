import * as React from 'react';
import useSWR from 'swr';
import { Box, Skeleton, Typography } from '@mui/material';
import { fetcher } from '../../utils/utils';

type ArtistsStoryProps = {
  value?: number
  artistId: number
}

function formatDes(str: string): Array<string> {
  return (str || '').replaceAll('●', '').split('\n');
}

function lastPunctuation(str: string): string {
  if (str.length < 15) return str.replaceAll('。', '');
  return str[str.length - 1] === '。' ? str : `${str}。`;
}


const ArtistsStory = (props: ArtistsStoryProps) => {

  const { value, artistId } = props;

  console.log('render ArtistsStory');

  // const { data } = useSWR(value === 1 ? () => ('/artist/desc?id=' + artistId) : null, fetcher);
  const { data } = useSWR(('/artist/desc?id=' + artistId), fetcher);

  // if (value !== 1) return null;
  if (!data) return (
    <>
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" width="60%" />

      <Skeleton animation="wave" sx={{ mt: 4 }} variant="rectangular" width="100%" height={180} />
      <Skeleton animation="wave" sx={{ mt: 4 }} variant="rectangular" width="100%" height={180} />
      <Skeleton animation="wave" sx={{ mt: 4 }} variant="rectangular" width="100%" height={180} />
    </>
  );
  return (
    <>
      <Typography lineHeight={1.9} sx={{ textIndent: '2em' }}>
        {data?.briefDesc}
      </Typography>

      {
        (data?.introduction || []).map((item: { ti: string, txt: string }) => (

          <React.Fragment key={item.ti}>

            {
              item.ti ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 6, bm: 3 }}>
                  <Box sx={{ height: 40, bgcolor: 'primary.main', width: 4, mr: 2 }} />
                  <Typography variant="h5" lineHeight={3} color="primary.main">
                    {item.ti}
                  </Typography>
                </Box>
              ) : <div style={{ height: 40 }} />
            }


            {
              formatDes(item.txt).map((o, index: number) => (
                <Typography key={index + item.ti} variant="subtitle1" lineHeight={1.9} sx={{ mb: 3 }}>
                  {lastPunctuation(o)}
                </Typography>
              ))
            }

          </React.Fragment>

        ))
      }
    </>
  );
};

export default React.memo(ArtistsStory);