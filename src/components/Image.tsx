import * as React from 'react';
import NextImage, { ImageProps } from 'next/image';
import { Skeleton } from '@mui/material';


interface FallImageProps extends ImageProps {
  alt?: string;
  className?: string;
  wave?: boolean;
}

function Image(props: FallImageProps) {

  const { onLoadingComplete, width, height, className, wave = true, ...reset } = props;


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
    <div style={{ position: 'relative', width, height }} className={className}>
      {
        !imgLoaded && wave && (
          <Skeleton
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} variant="rectangular"
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