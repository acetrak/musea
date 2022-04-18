import * as React from 'react';
import { useMemo } from 'react';
import { Box, Button, CardActionArea, Stack, Typography } from '@mui/material';
import useMeasure from 'react-use-measure';


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
        width
      }}
    >

      <CardActionArea sx={{ fontSize: 0 }} component={Link} href={`/artists/[id]`} linkAs={`/artists/${id}?tab=songs`}>
        <Box sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Image src={`${img1v1Url}?param=${WIDTH}y${WIDTH}`} width={width} height={width} alt={name} />
        </Box>
        <Box sx={{ py: 1 }}>
          <Typography sx={{ fontWeight: 'bold' }} color="text.primary" variant="subtitle1">{name}</Typography>
        </Box>
      </CardActionArea>

    </Box>

  );
};

const Ac = React.memo(ArtistsCard);


function TopArtists(props: TopArtistsProps) {

  const { artists = [] } = props;

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

  return (

    <Box ref={ref}>
      <Stack sx={{ mb: 4 }} alignItems="center" flexDirection="row" justifyContent="flex-start">
        <Typography variant="h6">歌手Top50</Typography>

        <Button
          component={Link}
          href="/top-artists"
          size="small"
          sx={{ borderRadius: 10, marginLeft: 'auto' }}
          variant="contained"
        >
          查看全部
        </Button>
      </Stack>

      <Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {
            artists.slice(0, count).map((o) => (
              <Ac width={width} item={o} key={o.id} />
            ))
          }
        </Box>

      </Box>

    </Box>

  );

}

export default TopArtists;