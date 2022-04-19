import * as React from 'react';
import { Box, Typography, Stack, CardActionArea } from '@mui/material';
import NextImage from 'next/image';
import { random } from 'lodash';

import { PersonalizedItem } from '../../pages/mv-collect';
import { millisecond2Minute, rgbDataURL, formatNumToTenThousand } from '../../utils/utils';
import { Link } from '../../components';


type PersonalizedCardProps = {
  mv: PersonalizedItem
}

function PersonalizedCard(props: PersonalizedCardProps) {

  const { mv } = props;

  const r = random(0, 255);
  const g = random(0, 255);
  const b = random(0, 255);
  return (


    <CardActionArea href={`/mv/[id]`} linkAs={`/mv/${mv.id}`} component={Link}>
      <Box sx={{ position: 'relative', fontSize: 0 }}>
        <NextImage
          src={mv.picUrl + '?param=320y180'}
          width={320}
          height={180}
          layout="responsive"
          placeholder="blur"
          blurDataURL={rgbDataURL(r, g, b)}
        />
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
          <Typography variant="caption">{millisecond2Minute(mv.duration)}</Typography>
        </Box>
      </Box>
      <Typography variant="subtitle1" pt={1} className="nowrap1" title={mv.name}>{mv.name}</Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" className="nowrap1">{mv.artistName}</Typography>
        <Typography
          variant="body2" className="nowrap1" color="text.secondary"
        >{formatNumToTenThousand(mv.playCount)}次播放</Typography>
      </Stack>
    </CardActionArea>

  );
}

export default PersonalizedCard;