import type { NextPage } from 'next';
import * as React from 'react';
import { useMemo } from 'react';
import Head from 'next/head';
import {
  alpha,
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

import { request } from '../utils/utils';


import { Image, Link } from '../components';
import { ArtistsItem } from '../features/index/TopArtists';


type ArtistsProps = {
  artists: Array<ArtistsItem>
}


const Artists: NextPage<ArtistsProps> = (props) => {

  const { artists = [] } = props;

  const theme: Theme = useTheme();

  const background = useMemo(() => {

    const bgcolor = theme.palette.background.default;

    const color1 = alpha(theme.palette.primary.main, 0.4);
    const color2 = alpha(theme.palette.primary.main, 0.4);

    const color5 = 'rgba(24,225,202,0.84)';
    const color6 = 'rgba(24,225,202,0.84)';

    const color7 = 'rgba(24,225,202,0.84)';
    const color8 = 'rgba(6,143,141,0.9)';
    const color3 = 'rgba(26,205,232,0.92)';
    const color4 = 'rgba(30,129,162,0.97)';


    return `radial-gradient(rgba(25,25,28,0) 50%,${bgcolor} 80%),conic-gradient(${color1} 0,${bgcolor} 15.2%,${bgcolor} 18.2%,${color3} 20.5%,${bgcolor} 30.2%,${bgcolor} 50%,${color5} 56.5%,${color3} 59.4%,${color6} 66.2%,${color7} 72.9%,${color8} 85.1%,${color3} 89.1%,${color4} 90.6%,${bgcolor} 93.7%,${color2} 100%)`;
  }, [theme]);


  return (
    <>
      <Head>
        <title>Melody - Top 50 歌手</title>
      </Head>

      <Box

        sx={{
          overflow: 'hidden',
          width: '100%',
          position: 'relative',
          // height: '100vh',
          // overflowY: 'auto',
          '&:before': {
            position: 'absolute',
            top: '-120%',
            right: '-125%',
            opacity: 1,
            width: '350%',
            height: '350%',
            content: `""`,
            display: 'block',
            background,
            animationName: 'art-bg-ani',
            animationDuration: '10s',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            zIndex: -1
          },
          '@keyframes art-bg-ani': {
            '0%': {
              transform: 'rotate(0deg)'
            },
            'to': {
              transform: 'rotate(20deg)'
            }
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '35vh',
            position: 'absolute',
            top: '0',
            right: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : 'primary.main',
              fontWeight: '300'
            }}
            mb={5}
          >
            Top 50 歌手
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            mt: '35vh',
            bgcolor: 'background.default',
            minHeight: '65vh'
          }}
        >
          <Container maxWidth="md">

            <Box pt={6} pb={14}>


              <List sx={{ width: '100%', padding: 0 }}>
                {
                  artists.map((item: ArtistsItem, index) => (
                    <CardActionArea
                      key={item.id} component={Link} href={`/artists/[id]`} linkAs={`/artists/${item.id}`}
                    >
                      <ListItem
                        alignItems="flex-start"
                      >
                        <ListItemAvatar sx={{ borderRadius: 1, overflow: 'hidden', mr: 2 }}>
                          <Image alt={item.name} src={item.img1v1Url} width={100} height={100} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack flexDirection="row" alignItems="center">
                              <Typography variant="h6" color="text.primary">
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
