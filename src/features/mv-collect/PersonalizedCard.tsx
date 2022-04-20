import * as React from 'react';
import { Box, Typography, Stack, CardActionArea, Skeleton } from '@mui/material';
import NextImage from 'next/image';
import { random } from 'lodash';


import { millisecond2Minute, rgbDataURL, formatNumToTenThousand } from '../../utils/utils';
import { Link } from '../../components';

type SkeletonCardProps = {}
export const SkeletonCard = (props: SkeletonCardProps) => {

  return (

    <Box sx={{ position: 'relative', fontSize: 0 }}>

      <Box sx={{ pt: '56.25%', position: 'relative' }}>
        <Skeleton
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          variant="rectangular"
          animation="wave"
        />

      </Box>
      <Skeleton variant="rectangular" sx={{ mt: 1.5 }} width="40%" height={20} animation="wave" />
    </Box>

  );
};
export type MvItem = {
  id: number
  name: string
  copywriter: string

  duration: number
  playCount: number
  artists: Array<{ id: number, name: string }>
  artistName: string
  artistId: number

  picUrl?: string
  cover?: string

  mv?: {
    duration?: number
  }

}
type PersonalizedCardProps = {
  mv: MvItem
}

function PersonalizedCard(props: PersonalizedCardProps) {

  const { mv } = props;

  const r = random(0, 255);
  const g = random(0, 255);
  const b = random(0, 255);

  const imgUrl = mv?.picUrl || mv?.cover;
  const duration = mv?.duration || mv?.mv?.duration;

  return (


    <CardActionArea
      href={`/mv/[id]`} linkAs={`/mv/${mv.id}`} sx={{ borderRadius: 1, overflow: 'hidden' }} component={Link}
    >
      <Box sx={{ position: 'relative', fontSize: 0 }}>
        <NextImage
          src={imgUrl + '?param=320y180'}
          width={320}
          height={180}
          layout="responsive"
          placeholder="blur"
          blurDataURL={rgbDataURL(r, g, b)}
        />
        {
          mv.duration && (
            <Box
              sx={{
                bgcolor: 'rgba(0,0,0,0.5)',
                py: 0.5,
                px: 1,
                color: '#fff',
                position: 'absolute',
                right: 8,
                bottom: 8
              }}
            >
              <Typography variant="caption">{millisecond2Minute(duration)}</Typography>
            </Box>
          )
        }

      </Box>
      <Typography variant="subtitle1" pt={1} className="nowrap2" title={mv.name}>{mv.name}</Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" className="nowrap1">{mv.artistName}</Typography>
        {
          mv.playCount && (
            <Typography
              variant="body2" className="nowrap1" color="text.secondary"
            >
              {formatNumToTenThousand(mv.playCount)}次播放
            </Typography>
          )
        }
      </Stack>
    </CardActionArea>

  );
}

export default PersonalizedCard;