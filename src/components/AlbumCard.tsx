import * as React from 'react';
import { Box, CardActionArea, Typography, TypographyVariant } from '@mui/material';
import NextImage from 'next/image';

import { Image, Link } from './index';
import { formatTime } from '../utils/utils';

export type AlbumsItem = {
  picUrl: string
  blurPicUrl: string
  publishTime: number
  subType: string
  name: string
  company: string
  id: number
  description: string
  alias: string[]
}

type AlbumCardProps = {
  album: AlbumsItem
  imageProps?: {
    width?: number
    height?: number
  }
  bgProps?: {
    width?: number
    height?: number
  }
  titleVariant?: TypographyVariant
}

const IMG_WIDTH = 140;
const IMG_HEIGHT = IMG_WIDTH +30;

const AlbumCard = (props: AlbumCardProps) => {

  const { album, imageProps, titleVariant = 'subtitle1', bgProps } = props;
  return (


    <Box
      href={`/album/[id]`}
      linkAs={`/album/${album.id}`}
      component={Link}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        textTransform: 'none',
        textDecoration: 'none',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <div style={{ position: 'relative', width: 480, height: IMG_HEIGHT }}>
          <NextImage
            alt={album.name}
            src={`${album.picUrl}?param=480y${IMG_HEIGHT}`}
            width={480}
            height={IMG_HEIGHT}
            {...bgProps}
          />
        </div>

      </Box>

      <CardActionArea
        sx={{
          color: '#ccc',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch'
        }}
      >
        <Image
          alt={album.name}
          src={`${album.picUrl}?param=${IMG_WIDTH}y${IMG_HEIGHT}`}
          width={IMG_WIDTH}
          height={IMG_HEIGHT}
          {...imageProps}
        />
        <Box
          sx={{
            flex: 1,
            py: 1,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <Typography
            color="grey.200" variant={titleVariant} className="nowrap2" fontWeight={600}
          >
            {album.name}
          </Typography>
          <Typography
            variant="body1" color="grey.500" className="nowrap1" gutterBottom
          >
            {album.subType}
          </Typography>
          <Typography variant="body1" color="grey.500" className="nowrap2">
            {album.alias.join(',')}
          </Typography>
          <div style={{ flex: 1 }} />
          <Typography
            variant="body2" color="grey.500" className="nowrap3"
          >
            {formatTime(album.publishTime)}
          </Typography>

        </Box>
      </CardActionArea>

    </Box>


  );
};
export default AlbumCard;