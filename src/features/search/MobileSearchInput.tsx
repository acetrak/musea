import * as React from 'react';
import { FormEventHandler } from 'react';
import { Box, IconButton, TextField, TextFieldProps, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type MobileSearchInput = {
  value: string
  onInput?: FormEventHandler<HTMLInputElement>
  keyword: string,
  onClearClick?: () => void
} & TextFieldProps

function MobileSearchInput(props: MobileSearchInput) {
  const { value, onInput, keyword, onClearClick, ...reset } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <TextField

        {...reset}
        placeholder="搜索歌曲，专辑等…"
        variant="outlined" size="small" sx={{
        width: '100%',
        '& .MuiInputBase-input': {
          pr: 6
        }
      }} type="text" value={value}
        onInput={onInput}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 1,
          right: 0

        }}
      >

        <Zoom in={Boolean(keyword)}>

          <IconButton onClick={onClearClick}>
            <CloseIcon
              sx={{
                fontSize: 18,
                cursor: 'pointer',
                '&:hover': {
                  color: 'grey.200'
                }
              }}
            />
          </IconButton>


        </Zoom>
      </Box>
    </Box>
  );
}

export default MobileSearchInput;