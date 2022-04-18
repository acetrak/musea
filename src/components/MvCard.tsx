import * as React from 'react';
import { Box, CardActionArea, Stack, Typography } from '@mui/material';
import NextImage from 'next/image';

import { random } from 'lodash';
import { Link } from './index';
import { formatNumToTenThousand, millisecond2Minute, rgbDataURL } from '../utils/utils';

export type MvCardProps = {
  mv: {
    cover?: string
    imgurl?: string
    imgurl16v9?: string
    artists?: Array<{
      id: number,
      name: string
    }>
    artist?: {
      id: number,
      name: string
    }
    artistName: string
    name: string
    playCount: number
    duration: number
    id: number
    publishTime?: string
  }
}


function MvCard(props: MvCardProps) {
  const { mv } = props;

  const r = random(0, 255);
  const g = random(0, 255);
  const b = random(0, 255);

  const url = (mv.cover || mv.imgurl || '') + `?param=360y220`;

  return (
    <CardActionArea href={`/mv/[id]`} linkAs={`/mv/${mv.id}`} component={Link}>

      <NextImage
        placeholder="blur"
        blurDataURL={rgbDataURL(r, g, b)}
        layout="responsive"
        src={url}
        width={360}
        height={220}
        alt={mv.name}
      />

      <Box py={1} sx={{ maxWidth: 360, overflow: 'hidden' }}>
        <Typography variant="body1" className="nowrap1">
          {mv.name}
        </Typography>

        {
          mv.artists && (
            <Typography variant="subtitle1" className="nowrap1" color="text.secondary">
              {mv.artists.map(o => o.name).join(',')}
            </Typography>
          )
        }

        <Stack flexDirection="row" alignItems="center">
          <Typography
            sx={{
              '&::after': {
                content: `'•'`,
                mx: 0.5
              }
            }} className="nowrap2" variant="body2" color="text.secondary"
          >
            {formatNumToTenThousand(mv.playCount)}次观看
          </Typography>

          <Typography className="nowrap2" variant="body2" color="text.secondary">
            {millisecond2Minute(mv.duration)}分
          </Typography>


        </Stack>

        {
          mv.publishTime && (
            <Typography className="nowrap2" variant="body2" color="text.secondary">
              {mv.publishTime}
            </Typography>
          )
        }
      </Box>
    </CardActionArea>
  );
}

export default React.memo(MvCard);