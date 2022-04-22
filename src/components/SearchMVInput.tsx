import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Router from 'next/router';
import Nprogress from 'nprogress';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,

  marginLeft: 0,
  width: 'auto'

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
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 320,
      '&:focus': {
        width: 520
      }
    }
  }
}));

function SearchMVInput() {

  const [value, setInput] = React.useState('');

  const onInput = (e: any) => {
    setInput(e.target.value);
  };

  const onKeyUp = async (e: any) => {


    if (e.keyCode === 13) {
      Nprogress.start();
      await Router.push(`/search?keyword=${value}&tab=4`);
    }

  };

  return (
    <Box sx={{ display: 'flex', mb: 3 }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          onKeyUp={onKeyUp}
          value={value}
          onInput={onInput}
          placeholder="搜索MV"
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
    </Box>
  );
}

export default React.memo(SearchMVInput);