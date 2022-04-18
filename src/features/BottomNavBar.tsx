import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import { CardActionArea, Paper, Stack } from '@mui/material';
import { NextRouter, useRouter } from 'next/router';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from '../components';

type NavButtonProps = {
  children?: any
  href?: string | undefined
  icon?: ReactNode
  selectedIcon?: ReactNode
  router: NextRouter
}


const NavButton = (props: NavButtonProps) => {

  const { children, href, icon, selectedIcon, router } = props;

  const selected = useMemo(() => {

    let url = String(href);
    if (url.indexOf('?') != -1) {
      url = url.split('?')[0];
    }

    return router.pathname === url;
  }, [router, href]);

  const exr = useMemo(() => href ? {
    href,
    component: Link
  } : {}, [href]);


  return (
    <>

      <CardActionArea

        {...exr}
        sx={{
          width: 'auto',
          color: 'primary.main'
        }}
      >

        <Stack
          sx={{
            width: 60,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center'

          }}
        >

          {
            selected ? selectedIcon : icon
          }

        </Stack>
      </CardActionArea>

    </>
  );
};

function BottomNavBar() {

  const router: NextRouter = useRouter();


  return (

    <>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 54,
          overflow: 'hidden'
        }}

      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: '100%',
            height: '100%'
          }}
        >

          <NavButton
            router={router}
            href="/"
            icon={<HomeOutlinedIcon sx={{ color: 'text.primary' }} />}
            selectedIcon={<HomeIcon />}
          >
            首页
          </NavButton>
          <NavButton
            router={router}
            href="/search"
            icon={<SearchOutlinedIcon sx={{ color: 'text.primary' }} />}
            selectedIcon={<SearchIcon />}
          >
            搜索
          </NavButton>
          <NavButton
            router={router}
            href="/about"
            icon={<InfoOutlinedIcon sx={{ color: 'text.primary' }} />}
            selectedIcon={<InfoIcon />}
          >
            关于
          </NavButton>


        </Stack>

      </Paper>

    </>
  );
}

export default BottomNavBar;