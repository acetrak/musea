import * as React from 'react';
import { Typography, Box, Stack, CardActionArea } from '@mui/material';
import { useDispatch } from 'react-redux';
import Image from '../components/Image';

import { PlaylistItem } from '../store/play/reducer';
import { addPlaylist } from '../store/play/action';

// https://mapi.acebook.cc/song/detail?ids=449578101

const list = [
  {
    cover: 'https://p1.music.126.net/-teyfCB0_9ZXq_G73D4wLA==/109951163738606984.jpg',
    name: 'il vento d\'oro',
    ar: '菅野祐悟',
    dt: 0,
    id: 1334780738
  },
  {
    cover: 'https://p1.music.126.net/3Zt3gNO-Q7OlyIS8Q8IyMQ==/18757668371533715.jpg',
    name: 'Killer',
    ar: '菅野祐悟',
    dt: 0,
    id: 449578101
  }
];


function Custom404() {


  const dispatch = useDispatch();

  const play = (item: PlaylistItem) => {

    addPlaylist(item)(dispatch);

  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Stack direction="row" alignItems="center" mb={10} mt={-5}>
        <Typography variant="h4">404</Typography>
        <Typography variant="h6">&nbsp;-&nbsp;该页面不存在</Typography>
      </Stack>

      <Box>
        <Typography variant="body2" color="text.secondary" mb={2}>听首轻音乐放松下吧^^</Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          {
            list.map(item => (
              <CardActionArea key={item.id} onClick={() => play(item)}>
                <Stack direction="row" alignItems="center" sx={{ minWidth: 280 }}>
                  <Image alt={item.name} src={item.cover + '?parma=50y50'} width={60} height={60} />
                  <Stack ml={2}>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.ar}</Typography>
                  </Stack>

                </Stack>

              </CardActionArea>
            ))
          }
        </Stack>

      </Box>
    </Box>

  );
}

export default Custom404;