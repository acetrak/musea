import { Box, Stack, Typography } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import * as React from 'react';

import { Image } from './index';

export type CommentItem = {
  content: string,
  commentId: number
  likedCount: number
  timeStr: string
  time: number
  user: {
    avatarUrl: string
    nickname: string
    userId: number
  }
}

function CommentCard(props: { item: CommentItem }) {
  const { item } = props;

  return (
    <>

      <Stack flexDirection="row" mb={4}>
        <div>
          <Box sx={{ borderRadius: '100%', overflow: 'hidden', width: 40, height: 40 }}>
            <Image borderRadius alt={item?.user?.nickname} width={40} height={40} src={item?.user?.avatarUrl} />
          </Box>
        </div>
        <Box sx={{ flex: 1, pl: 2 }}>
          <Stack flexDirection="row" alignItems="center" mb={0.5}>
            <Typography variant="body1">{item?.user?.nickname} </Typography>
            <Typography color="text.secondary" variant="caption" ml={1}>{item?.timeStr}</Typography>
          </Stack>

          <Typography variant="body2">{`${item?.content}`}</Typography>

          <Stack flexDirection="row" alignItems="center">
            <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography
              ml={0.5} variant="caption"
            >
              {item?.likedCount}
            </Typography>
          </Stack>
        </Box>

      </Stack>
    </>
  );
}

export default React.memo(CommentCard);