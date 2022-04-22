import * as React from 'react';
import { useMemo, useState, useCallback } from 'react';
import { Box, Button, CardActionArea, Container, Stack, Theme, Typography, IconButton } from '@mui/material';
import useMeasure from 'react-use-measure';
import { chunk } from 'lodash';
import SwipeableViews from 'react-swipeable-views';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { Image, Link } from '../../components';
import useMediaQueryKey from '../../hooks/useMediaQueryKey';

const WIDTH = 160;
const GAP = 20;

export type ArtistsItem = {
  name?: string
  img1v1Url: string
  id: number
  albumSize: number
  alias?: Array<string>
  _fake?: boolean | undefined
}

type TopArtistsProps = {
  artists: Array<ArtistsItem>

}

const ArtistsCard = (props: { item: ArtistsItem, width: number }) => {

  const { item, width } = props;

  const { name, img1v1Url, id } = item;
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        fontSize: 0,
        boxShadow: 0,
        width,
        mr: GAP + 'px'
      }}
    >

      <CardActionArea sx={{ fontSize: 0 }} component={Link} href={`/artists/[id]`} linkAs={`/artists/${id}?tab=songs`}>

        <Box sx={{ position: 'relative' }}>
          <Image
            borderRadius={4} src={`${img1v1Url}?param=${WIDTH}y${WIDTH}`} width={width} height={width} alt={name}
          />

          <Box
            sx={{
              backgroundImage: (theme: Theme) => `linear-gradient(to top,rgba(0,0,0,0.7),transparent)`,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              p: 1,
              pt: 2
            }}
          >
            <Typography color="#fff" variant="subtitle1">{name}</Typography>
          </Box>
        </Box>

      </CardActionArea>

    </Box>

  );
};

const Ac = React.memo(ArtistsCard);


function TopArtists(props: TopArtistsProps) {

  const { artists = [] } = props;

  const [tab, setTab] = useState(0);

  const [ref, bound] = useMeasure();
  const key = useMediaQueryKey();

  const count = useMemo(() => {
    switch (key) {
      case 'xl':
        return 9;
      case 'lg':
        return 9;
      case 'md':
        return 6;
      case 'sm':
        return 5;
      case 'xs':
        return 4;
      default:
        return 0;
    }
  }, [key]);

  const width = useMemo(() => {
    const boxWidth = bound.width;
    return (boxWidth - (count - 1) * GAP) / count;
  }, [count, bound.width]);

  const chunkList = useMemo(() => chunk(artists, count), [artists, count]);

  const onChangeIndex = useCallback((index: number) => {
    setTab(index);
  }, []);

  const prev = () => {
    setTab(prevState => prevState - 1);
  };

  const next = () => {
    setTab(prevState => prevState + 1);
  };

  return (

    <Box sx={{ position: 'relative' }}>

      <Container maxWidth="xl">


        <Box ref={ref} sx={{ position: 'relative' }}>
          <Stack sx={{ mb: 6, pt: 6 }} alignItems="center" flexDirection="row" justifyContent="flex-start">
            <Typography variant="h6">热门歌手</Typography>

            <Stack ml="auto" direction="row" alignItems="center">
              <IconButton onClick={prev} disabled={tab === 0}>
                <ChevronLeftIcon />
              </IconButton>

              <IconButton onClick={next} disabled={tab === chunkList.length - 1}>
                <ChevronRightIcon />
              </IconButton>
              <Button
                component={Link}
                href="/top-artists"
                size="small"
                sx={{ borderRadius: 10, ml: 2 }}
                variant="contained"
                color="secondary"
              >
                查看全部
              </Button>
            </Stack>

          </Stack>

          <Box>


            <SwipeableViews
              axis="x"
              index={tab}
              onChangeIndex={onChangeIndex}
            >

              {
                chunkList.map((data, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {
                      data.map((o) => (
                        <Ac width={width} item={o} key={o.id} />
                      ))
                    }
                  </Box>
                ))
              }
            </SwipeableViews>


          </Box>


        </Box>
      </Container>


      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '85%',
          bgcolor: 'background.paper',
          // backgroundImage: (theme: Theme) => `linear-gradient(45deg,${theme.palette.primary.main} 60%,${theme.palette.secondary.main})`,
          zIndex: -1
        }}
      >
      </Box>
    </Box>


  );

}

export default TopArtists;