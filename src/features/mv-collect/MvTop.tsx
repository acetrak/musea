import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Box, Fab, ImageList, ImageListItem, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useSWRInfinite from 'swr/infinite';
import { get } from 'lodash';
import SquareFillTabs from '../../components/tabs/SquareFillTabs';
import PersonalizedCard, { MvItem, SkeletonCard } from './PersonalizedCard';

const ITEMS = ['内地', '港台', '欧美', '日本', '韩国'];

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ position: 'relative' }}
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      <Box sx={{ py: 0, m: 0 }}>
        {value === index ? children : null}
      </Box>
    </div>
  );
};

type LayoutProps = {
  children: any
}
const Layout = (props: LayoutProps) => {
  const { children } = props;
  return (
    <ImageList cols={4} gap={30}>
      {children}
    </ImageList>
  );
};

type List = {
  code: number,
  data: Array<MvItem>
  hasMore: boolean
}

const PAGE_SIZE = 8;

function MvTop() {


  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);

  const onChange = (e: any, newValue: number) => {
    setTab(newValue);
    setPage(0);
  };


  const { data, error, size, setSize } = useSWRInfinite(
    (index: number) => {
      const offset = index * PAGE_SIZE;
      return `/top/mv?limit=${PAGE_SIZE}&area=${ITEMS[tab]}&offset=${offset}`;
    }
  );


  const list: List[] = useMemo(() => data ? [].concat(...data) : [], [data]);

  const listLength: number = useMemo(() => list.length, [list]);

  const isEmpty = useMemo(() => get(list, '0.data.length', 0) === 0, [list]);

  const isReachingEnd = useMemo(() => isEmpty || (!list[list.length - 1]?.hasMore),
    [isEmpty, list]);

  const onChangeIndex = useCallback((index: number) => {
    setPage(index);
  }, []);

  const prev = useCallback(() => {

    setPage(prevState => prevState - 1);

  }, []);

  const next = useCallback(async () => {

    setPage(prevState => prevState + 1);

    if (!isReachingEnd) {
      await setSize(size + 1);
    }

  }, [isReachingEnd, setSize, size]);

  const loadingDom = useMemo(() => (
    <TabPanel key={`loadingDom_${listLength}`} value={page} index={listLength}>
      <Layout>
        {
          Array.from({ length: PAGE_SIZE }).map((o, i) => <SkeletonCard key={`SkeletonCard${i}`} />)
        }
      </Layout>
    </TabPanel>
  ), [listLength, page]);

  const swiperDom = useMemo(() => {

    const arr = list.map((item, index) => {

      if (item.code == 200) {
        return (
          <TabPanel key={`TabPanel${index}`} value={page} index={index}>
            <Layout>
              {
                item.data.map((mv) => (
                  <ImageListItem key={mv.id}>
                    <PersonalizedCard mv={mv} />
                  </ImageListItem>
                ))
              }
            </Layout>
          </TabPanel>
        );
      }
      return null;

    }).filter(o => o !== null);

    arr.push(loadingDom);

    return arr;

  }, [list, loadingDom, page]);


  const showNext = useMemo(() => {
    if (page === size - 1) {
      return !isReachingEnd;
    }

    return page <= size - 1;
  }, [isReachingEnd, page, size]);

  return (
    <>


      <Typography variant="h6" pb={1} pt={2}>MV排行</Typography>

      <Box pb={3}>
        <SquareFillTabs items={ITEMS} value={tab} onChange={onChange} />
      </Box>


      <Box
        sx={{
          position: 'relative'

        }}
      >

        <SwipeableViews
          axis="x"
          index={page}
          onChangeIndex={onChangeIndex}
        >
          {
            swiperDom
          }

        </SwipeableViews>


        {
          showNext && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,

                transform: 'translate(50%,-50%)'
              }}

            >
              <Fab color="primary" onClick={next} size="small">
                <ChevronRightIcon />
              </Fab>
            </Box>

          )
        }

        {
          page > 0 && (
            <Box

              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,


                transform: 'translate(-50%,-50%)'

              }}
            >
              <Fab color="primary" onClick={prev} size="small">
                <ChevronLeftIcon />
              </Fab>
            </Box>
          )
        }


      </Box>

    </>
  );
}

export default MvTop;