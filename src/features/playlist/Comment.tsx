import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { find } from 'lodash';
import { Box, Portal, Stack, Typography } from '@mui/material';

import SortMenu, { COMMENT_SORT, SORT_VALUE } from '../../components/CommentSortMenu';
import CommentsList from '../CommentsList';

type CommentProps = {
  playlistId: number
  commentCount?: number
}


function Comment(props: CommentProps) {

  const { playlistId } = props;
  const [total, setTotal] = useState(0);


  const [sort, setSort] = useState(() => SORT_VALUE.HOT);

  const sortType = useMemo(() => {
    const target = find(COMMENT_SORT, ['value', sort]);
    return target?.alis || 2;
  }, [sort]);


  const onItemClick = useCallback((sort) => {

    setSort(sort);

  }, []);

  const onTotal = useCallback((val: number) => {
    if (val !== total)
      setTotal(val);
  }, [total]);


  return (
    <>

      <Portal container={() => document?.querySelector('#playlist_sort_j83e3')}>

        <Stack flexDirection="row" alignItems="center">
          <Typography sx={{ fontSize: 18 }}>{total} 条评论</Typography>

          <Box ml={5}>
            <SortMenu onItemClick={onItemClick} sort={sort} />
          </Box>

        </Stack>
      </Portal>

      <Box
        sx={{
          minHeight: 600
        }}
      >
        <CommentsList onTotal={onTotal} type="2" sortType={sortType} id={playlistId} />
      </Box>

    </>
  );
}

export default React.memo(Comment);