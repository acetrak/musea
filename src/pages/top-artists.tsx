import type { NextPage } from 'next';
import * as React from 'react';
import { useMemo } from 'react';
import Head from 'next/head';
import {
  Box,
  CardActionArea,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Theme,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { getIsMobile, request } from '../utils/utils';

import { Image, Link } from '../components';
import { ArtistsItem } from '../features/index/TopArtists';
import useMediaQueryKey from '../hooks/useMediaQueryKey';
import { appName } from '../constant';

type ArtistsProps = {
  artists: Array<ArtistsItem>
}

const Artists: NextPage<ArtistsProps> = (props) => {

  const { artists = [] } = props;

  const theme: Theme = useTheme();


  const key = useMediaQueryKey();
  const imgWidth = useMemo(() => {
    switch (key) {
      case 'xl':
        return 100;
      case 'lg':
        return 100;
      case 'md':
        return 100;
      case 'sm':
        return 60;
      case 'xs':
        return 60;
      default:
        return 0;
    }
  }, [key]);

  const isMobile = getIsMobile(key);

  const headMt = isMobile ? '20vh' : '25vh';

  return (
    <>
      <Head>
        <title>{appName} - Top 50 歌手</title>
      </Head>

      <Box

        sx={{
          overflow: 'hidden',
          width: '100%',
          position: 'relative',

          height: headMt,
          backgroundImage: (theme: Theme) => theme.palette.mode==='dark'?
            `linear-gradient(45deg,${theme.palette.primary.main},${theme.palette.secondary.main})`:
            `linear-gradient(45deg,${theme.palette.primary.light},${theme.palette.secondary.light})`

        }}
      >
        {/*<NextImage src={bgPic} layout="responsive" className="bgPic" />*/}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            right: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(30px)'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: '300'
            }}
            mb={5}
          >
            Top 50 歌手
          </Typography>
        </Box>


      </Box>

      <Box
        sx={{
          width: '100%',

          bgcolor: 'background.default'

        }}
      >
        <Container maxWidth="md" disableGutters>

          <Box pt={6} pb={14}>


            <List sx={{ width: '100%', padding: 0 }}>
              {
                artists.map((item: ArtistsItem) => (
                  <CardActionArea
                    key={item.id} component={Link} href={`/artists/[id]`} linkAs={`/artists/${item.id}`}
                  >
                    <ListItem
                      alignItems="flex-start"
                    >
                      <ListItemAvatar sx={{ borderRadius: 1, overflow: 'hidden', mr: 2 }}>
                        <Image alt={item.name} src={item.img1v1Url} width={imgWidth} height={imgWidth} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack flexDirection="row" alignItems="center">
                            <Typography
                              variant={isMobile ? 'subtitle1' : 'h6'} color="text.primary"
                            >
                              {item.name}
                            </Typography>

                            <Typography
                              sx={{ ml: 'auto' }}
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              className="nowrap2"
                            >
                              专辑数:{item.albumSize}
                            </Typography>

                          </Stack>
                        }
                        secondary={
                          <React.Fragment>

                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              className="nowrap2"
                            >
                              {item.alias?.join(',')}
                            </Typography>


                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </CardActionArea>
                ))
              }

            </List>


          </Box>


        </Container>


      </Box>

    </>

  );
};

export default Artists;


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
