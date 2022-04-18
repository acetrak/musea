import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { last } from 'lodash';
import { InView } from 'react-intersection-observer';

import CommentCard, { CommentItem } from '../components/CommentCard';
import { request } from '../utils/utils';

// type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
//
// 0: 歌曲
//
// 1: mv
//
// 2: 歌单
//
// 3: 专辑
//
// 4: 电台
//
// 5: 视频
//
// 6: 动态


type CommentProps = {
  id: number,
  type: string | number,
  sortType: string | number
  onTotal?: (total: number) => void
}

const PAGE_SIZE = 20;


// @ts-ignore
const getUrl = ({ id, sortType, cursor, pageNo, type }) => {

  if (sortType === 3 && pageNo > 1)
    return `/comment/new?type=${type}&id=${id}&sortType=${sortType}&cursor=${cursor}&pageSize=${PAGE_SIZE}&pageNo=${pageNo}`;
  return `/comment/new?type=${type}&id=${id}&sortType=${sortType}&pageSize=${PAGE_SIZE}&pageNo=${pageNo}`;
};

const initState = {
  pageNo: 0,
  cursor: '' as number | string,

  totalCount: 0,
  list: [] as Array<CommentItem>,
  hasMore: true
};

function CommentsList(props: CommentProps) {
  const { id, type, sortType, onTotal } = props;

  const prevId = useRef<number | null>(null);

  const [state, setState] = useState(() => {
    return {
      ...initState
    };
  });

  const [refreshing, setRefreshing] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetching, setFetching] = useState(false);


  const fetchData = useCallback(async (urlParse?: any) => {

    urlParse.pageNo += 1;
    const url = getUrl(urlParse);

    let result;
    try {
      setFetching(true);
      result = await request(url);
      setRefreshing(false);
      setFetching(false);
      setLoadingMore(false);

      if (result.code === 200) {

        const { comments, hasMore, totalCount, sortType } = result.data;
        let _cursor: number | string = '';

        if (sortType === 3) {
          const t: CommentItem | undefined = last(comments);
          _cursor = t?.time || '';
        }

        if (typeof onTotal === 'function') onTotal(totalCount);

        setState(prevState => {
          const { list } = prevState;

          return ({
            pageNo: urlParse.pageNo,
            cursor: _cursor,

            hasMore,
            totalCount,
            list: urlParse.pageNo === 1 ? comments as CommentItem[] : list.concat(comments)
          });
        });


      }

    } catch (e) {
      console.log(e);

    }


  }, []);

  useEffect(() => {


    setRefreshing(true);

    if (prevId.current !== id) {
      prevId.current = id;
      setState(({ ...initState }));
    }
    fetchData({
      pageNo: 0,
      cursor: '',
      sortType,
      type,
      id
    }).then(() => {
    });
  }, [fetchData, id, sortType, type]);


  const onInViewChange = useCallback((inView: boolean, entry: any) => {

    if (inView && !fetching && state.pageNo !== 0) {
      setLoadingMore(true);

      fetchData({
        cursor: state.cursor,
        pageNo: state.pageNo,
        id,
        sortType,
        type
      }).then(() => {

      });
    }
  }, [fetchData, fetching, state, id, sortType, type]);


  return (
    <Box sx={{ position: 'relative' }}>

      {
        refreshing ? (
          <CircularProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        ) : null
      }

      <Box sx={{ filter: refreshing ? 'brightness(0.5)' : 'brightness(1)' }}>
        {
          state.list.map(item => (<CommentCard item={item} key={item.commentId} />))
        }

      </Box>


      {
        state.hasMore ? (
          // @ts-ignore
          <InView as="div" onChange={onInViewChange}>
            <div style={{ height: 34 }} />
          </InView>
        ) : null
      }


      {
        loadingMore ? (
          <Stack mb={3} alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : null
      }


      {
        (!state.hasMore && state.pageNo !== 0) ? (
          <Typography align="center" py={3} color="text.secondary">评论加载完毕</Typography>
        ) : null
      }


    </Box>
  );

}

export default React.memo(CommentsList);