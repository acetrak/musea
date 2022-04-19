import * as React from 'react';
import { Box, TextField, TextFieldProps } from '@mui/material';
import { useCallback, FormEventHandler } from 'react';

type MobileSearchInput = {
  value: string
  onInput?: FormEventHandler<HTMLInputElement>
  keyword:string,
} & TextFieldProps

function MobileSearchInput(props: MobileSearchInput) {
  const { value, onInput, ...reset } = props;
  return (
    <Box>
      <TextField
        {...reset}
        placeholder="搜索歌曲，专辑等…"
        variant="outlined" size="small" sx={{ width: '100%' }} type="text" value={value}
        onInput={onInput}
      />
    </Box>
  );
}

export default MobileSearchInput;