import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { Box, Chip, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import useSWRInfinite from 'swr/infinite';
import { get } from 'lodash';
import { useRouter } from 'next/router';

import PageLayout from '../components/PageLayout';
import SearchMVInput from '../components/SearchMVInput';
import { appName } from '../constant';
import PersonalizedCard, { MvItem, SkeletonCard } from '../features/mv-collect/PersonalizedCard';


const AREA = [
  '内地', '港台', '欧美', '日本', '韩国'
];
const TYPE = [
  '官方版', '原生', '现场版', '网易出品'
];
const ORDER = [
  '上升最快', '最热', '最新'
];

type  AreaProps = {
  onChange?: (e: any, area: { [x: string]: string | undefined }) => void
  value?: string
  title?: string
  items: string[]
  flag: string
}

const Choice = React.memo(function Area(props: AreaProps) {

  const { onChange, value, items, title, flag } = props;
  return (
    <Stack direction="row" mb={2}>
      <Box mr={1.5}>
        <Typography>
          {title}:
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1.5}>
        {
          items.map(item => (
            <Chip
              onClick={(e: any) => onChange?.(e, { [flag]: value === item ? undefined : item })}
              variant={item === value ? 'filled' : 'outlined'} clickable key={item + 'AREA'}
              label={item.replace('网易出品', '独家放送')}
              color="primary"
            />
          ))
        }
      </Stack>
    </Stack>
  );
});


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

const PAGE_SIZE = 24;

function MvAll() {

  // const [condition, setCondition] = useState<{ [x: string]: string | undefined }>({
  //   area: undefined,
  //   type: undefined,
  //   order: undefined
  // });

  const router = useRouter();


  const area = get(router, 'query.area', undefined);
  const type = get(router, 'query.type', undefined);
  const order = get(router, 'query.order', undefined);

  const condition: { [x: string]: string | undefined } = useMemo(() => ({ area, type, order }), [area, type, order]);

  const conditionStr = useMemo(() => {
    const arr = Object.keys(condition).filter(key => condition[key]).map(key => `${key}=${condition[key]}`);
    if (arr.length === 0) return '';
    return '&' + arr.join('&');
  }, [condition]);

  const onConditionChange = useCallback(async (e, val) => {

    const newCondition = { ...condition, ...val };
    const arr = Object.keys(newCondition).filter(key => newCondition[key]).map(key => `${key}=${newCondition[key]}`);
    const url = arr.length ? `/mv-all?${arr.join('&')}` : '/mv-all';
    await router.push(url, undefined, { shallow: true });

  }, [condition, router]);


  const { data, error, size, setSize } = useSWRInfinite(
    (index: number) => {
      const offset = index * PAGE_SIZE;
      return `/mv/all?limit=${PAGE_SIZE}&offset=${offset}${conditionStr}`;
    }
  );


  const list: List[] = useMemo(() => data ? [].concat(...data) : [], [data]);

  const listLength: number = useMemo(() => list.length, [list]);

  const isEmpty = useMemo(() => get(list, '0.data.length', 0) === 0, [list]);

  const isReachingEnd = useMemo(() => isEmpty || (!list[list.length - 1]?.hasMore), [isEmpty, list]);

  const isLoadingInitialData = !data && !error;

  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');


  const next = useCallback(async () => {

    if (!isReachingEnd) {
      await setSize(size + 1);
    }

  }, [isReachingEnd, setSize, size]);


  const loadingDom = useMemo(() => (
    <Layout key={`MvTop_loadingDom_${listLength}`}>
      {
        Array.from({ length: 8 }).map((o, i) => <SkeletonCard key={`MvTop_SkeletonCard${i}`} />)
      }
    </Layout>
  ), [listLength]);

  const dataDom = useMemo(() => {

    const arr = list.map((item, index) => {

      if (item.code == 200) {
        return (
          <Layout key={`MvTop_TabPanel${index}`}>
            {
              item.data.map((mv) => (
                <ImageListItem key={mv.id}>
                  <PersonalizedCard mv={mv} />
                </ImageListItem>
              ))
            }
          </Layout>
        );
      }
      return null;

    }).filter(o => o !== null);

    if (!isReachingEnd || isLoadingInitialData)
      arr.push(loadingDom);

    return arr;

  }, [isLoadingInitialData, isReachingEnd, list, loadingDom]);

  const onScroll = useCallback(() => {

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;

    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    if (((scrollHeight - scrollTop - windowHeight) <= (windowHeight / 2)) && !isLoadingMore) {


      next().then(() => {
      });

    }

  }, [isLoadingMore, next]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);


  return (
    <>
      <Head>
        <title>{appName} - 所有MV</title>
      </Head>

      <PageLayout sx={{ pt: 3 }}>
        <SearchMVInput />
        <Box pb={3}>
          <Choice items={AREA} flag="area" title="地区" onChange={onConditionChange} value={condition.area} />
          <Choice items={TYPE} flag="type" title="类型" onChange={onConditionChange} value={condition.type} />
          <Choice items={ORDER} flag="order" title="排序" onChange={onConditionChange} value={condition.order} />
        </Box>

        {
          dataDom
        }


        {
          isReachingEnd && !isLoadingMore && (
            <Typography align="center" color="text.secondary" pt={8}>暂无更多</Typography>
          )
        }
      </PageLayout>


    </>
  );
}

export default MvAll;

export async function getStaticProps() {
  return {
    props: {
      hideAudio: true
    }
  };
}

