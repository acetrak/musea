import * as React from 'react';
import NextImage, { ImageProps } from 'next/image';
import { Skeleton, Box } from '@mui/material';
import { useMemo } from 'react';


interface FallImageProps extends ImageProps {
  alt?: string;
  className?: string;
  wave?: boolean;
  borderRadius?: boolean | string | number;
}

function Image(props: FallImageProps) {

  const { onLoadingComplete, width, height, className, wave = true, borderRadius, ...reset } = props;


  const [imgLoaded, setImgLoaded] = React.useState(false);

  const handleLoadingComplete = (arg: { naturalWidth: number; naturalHeight: number; }) => {

    if (wave) {
      setImgLoaded(true);
    }

    if (typeof onLoadingComplete === 'function') {
      onLoadingComplete(arg);
    }

  };

  const br = useMemo(() => {
    if (typeof borderRadius === 'boolean') return '100%';
    if (typeof borderRadius === 'string' || typeof borderRadius === 'number') return borderRadius;

    return 'unset';
  }, [borderRadius]);

  return (
    <Box
      sx={{ position: 'relative', width, height, borderRadius: br }}
      className={className}
    >
      {
        !imgLoaded && wave && (
          <Skeleton
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: borderRadius ? '100%' : 'unset'
            }}
            variant="rectangular"
            animation="wave"
          />
        )
      }

      <NextImage
        className={className}
        width={width}
        height={height}
        {...reset}
        alt={props.alt}
        onLoadingComplete={handleLoadingComplete}
      />
    </Box>
  );
}

export default Image;