import * as React from 'react';
import { Typography } from '@mui/material';

type ErrorProps = {}

const Error = (props: ErrorProps) => {

  return (
    <>
      <Typography color="grey.500" align="center">
        请求出错,请稍后重试
      </Typography>

    </>
  );

};

export default React.memo(Error);