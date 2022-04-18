import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { find } from 'lodash';
import { Box, Stack, Typography } from '@mui/material';

import SortMenu, { COMMENT_SORT, SORT_VALUE } from '../../components/CommentSortMenu';
import CommentsList from '../CommentsList';

type CommentProps = {
  mvId: number
}


function Comment(props: CommentProps) {

  const { mvId } = props;

  const [sort, setSort] = useState(() => SORT_VALUE.HOT);
  const [total, setTotal] = useState(0);

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

      <Stack flexDirection="row" alignItems="center" mt={4}>
        <Typography sx={{ fontSize: 18 }}>{total} 条评论</Typography>

        <Box ml={5}>
          <SortMenu onItemClick={onItemClick} sort={sort} />
        </Box>

      </Stack>

      <Box
        sx={{
          minHeight: 600,
          pt: 4
        }}
      >
        <CommentsList onTotal={onTotal} type="1" sortType={sortType} id={mvId} />
      </Box>

    </>
  );
}

export default React.memo(Comment);