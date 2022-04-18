import * as React from 'react';
import { Typography, Box } from '@mui/material';
import Error from './Error';

type ResultTipProps = {
  loading?: boolean
  hasData?: boolean
  error?: boolean
}

function ResultTip(props: ResultTipProps) {

  const { loading, hasData, error } = props;
  if (loading || hasData) return null;

  if (error) return <Error />;
  return (
    <Box
      sx={{
        py: 4
      }}
    >
      <Typography align="center" color="grey.500">暂无数据</Typography>
    </Box>
  );
}

export default ResultTip;