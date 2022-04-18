import * as React from 'react';

import { styled } from '@mui/material/styles';
import { InputBase, InputBaseProps, Box, IconButton, Zoom } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, useImperativeHandle, useRef, ForwardedRef } from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  // backgroundColor: alpha(theme.palette.common.white, 0.1),
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(20px)',
  // '&:hover': {
  //   backgroundColor: theme.palette.background.default
  //   // backgroundColor: theme.palette.,
  // },
  marginLeft: 0,
  width: '100%'
  // [theme.breakpoints.up('sm')]: {
  //   marginLeft: theme.spacing(1),
  //   width: 'auto'
  // },
  // border: '1px solid #ccc'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  // width: '100%',
  flex: 1,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%'
    // [theme.breakpoints.up('sm')]: {
    //   width: '12ch',
    //   '&:focus': {
    //     width: '20ch'
    //   }
    // }
  }
}));

type SearchBoxProps = {
  onClearClick: () => void
  keyword: string

} & InputBaseProps

export type SearchBoxRef = {
  focus: () => void
  blur: () => void
}

const SearchBox = forwardRef(function SearchBox(props: SearchBoxProps, ref: ForwardedRef<SearchBoxRef>) {

  const { value, keyword, onClearClick, ...reset } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    }
  }), []);

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          ref={inputRef}
          value={value}
          placeholder="搜索歌曲，专辑等…"
          inputProps={{ 'aria-label': 'search' }}
          {...reset}
        />
        <Zoom in={Boolean(keyword)}>
          <Box>
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

          </Box>
        </Zoom>

      </Search>
    </>
  );
});

export default SearchBox;