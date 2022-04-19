import * as React from 'react';
import NextImage, { ImageProps } from 'next/image';
import { Skeleton } from '@mui/material';


interface FallImageProps extends ImageProps {
  alt?: string;
  className?: string;
  wave?: boolean;
  borderRadius?: boolean;
}

function Image(props: FallImageProps) {

  const { onLoadingComplete, width, height, className, wave = true, borderRadius = false, ...reset } = props;


  const [imgLoaded, setImgLoaded] = React.useState(false);

  const handleLoadingComplete = (arg: { naturalWidth: number; naturalHeight: number; }) => {

    if (wave) {
      setImgLoaded(true);
    }

    if (typeof onLoadingComplete === 'function') {
      onLoadingComplete(arg);
    }

  };

  return (
    <div
      style={{ position: 'relative', width, height, borderRadius: borderRadius ? '100%' : 'unset' }}
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
    </div>
  );
}

export default Image;