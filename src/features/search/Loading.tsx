import * as React from 'react';
import { CircularProgress, Stack } from '@mui/material';


type LoadingProps = {}

const Loading = (props: LoadingProps) => {

  return (

    <Stack alignItems="center" justifyContent="center" py={6}>
      <CircularProgress />
    </Stack>

  );

};

export default React.memo(Loading);