// @ts-ignore
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { alpha, Box, Container, Fade, Grow, Tab, Tabs, Theme, AppBar, Typography } from '@mui/material';
import { NextPage } from 'next';
import { get, trim } from 'lodash';
import SwipeableViews from 'react-swipeable-views';
import { useRouter } from 'next/router';
import Head from 'next/head';

import SearchInput, { SearchBoxRef } from '../features/search/SearchInput';
import Songs from '../features/search/Songs';
import Singer from '../features/search/Singer';
import Album from '../features/search/Album';
import SuggestWord from '../features/search/SuggestWord';
import Playlist from '../features/search/Playlist';
import HotSearchWord from '../features/search/HotSearchWord';
import Mv from '../features/search/Mv';
import PageLayout, { LayoutData } from '../components/PageLayout';
import useMediaQueryKey from '../hooks/useMediaQueryKey';
import { getIsMobile } from '../utils/utils';
import MobileSearchInput from '../features/search/MobileSearchInput';


type SearchProps = {
  artists: []
}
const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      <Box sx={{ py: 3, m: 0.5 }}>
        {value === index ? children : null}
      </Box>
    </div>
  );
};

interface StringArray {
  [index: string]: string | number | undefined;
}

function getUrl(obj: StringArray) {
  const arr: string[] = [];
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'number' || Boolean(obj[key])) arr.push(`${key}=${obj[key]}`);
  });

  return arr.length ? `/search?${arr.join('&')}` : '/search';
}

//type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)


const Search: NextPage<SearchProps> = () => {

  const router = useRouter();


  const keyword = get(router, 'query.keyword', '');
  const tab = Number(get(router, 'query.tab', 0));

  const [input, setInput] = useState(keyword);
  const [inputFocus, setInputFocus] = useState(false);

  const formatInput = trim(input);

  const queryKey = useMediaQueryKey();

  const isMobile = getIsMobile(queryKey);

  const onInput = (e: any) => {
    setInput(e.target.value);

    if (!inputFocus) {
      setInputFocus(true);
    }
  };

  useEffect(() => {
    setInput(keyword);
  }, [keyword]);

  const onKeyPress = async (event: any) => {

    if ((event.code === 'Enter' || event.keyCode === 13) && formatInput) {
      const url = getUrl({ keyword: formatInput, tab });
      await router.push(url, undefined, { shallow: true });
      setInputFocus(false);
    }
  };

  const handleTab = useCallback(async (val: string | number | undefined) => {
    const url = getUrl({ keyword, tab: val });
    await router.push(url, undefined, { shallow: true });
  }, [keyword, router]);

  const handleChange = async (_: any, newValue: number) => {
    await handleTab(newValue);
  };

  const handleSearch = useCallback(async (value: string) => {
    setInput(value);
    const url = getUrl({ keyword: value, tab });
    await router.push(url, undefined, { shallow: true });
  }, [router, tab]);

  const handleHotSearchWordClick = useCallback(async (word: string) => {
    await handleSearch(word);
  }, [handleSearch]);

  const onClearClick = useCallback(async () => {
    await router.push('/search', undefined, { shallow: true });
  }, [router]);


  const onBlur = useCallback(() => {
    console.log('onBlur');
    setInputFocus(false);
  }, []);

  const onFocus = useCallback(() => {
    setInputFocus(true);
  }, []);

  const deferredQuery = useDeferredValue(input);

  const suggestions = useMemo(() =>
      isMobile ? null : <SuggestWord input={deferredQuery} />
    , [deferredQuery, isMobile]
  );

  return (
    <>

      {
        isMobile && (

          <>

            <AppBar
              enableColorOnDark

              position="sticky"
              sx={{
                px: 1,
                pt: 4,
                pb: 3,
                bgcolor: 'background.paper',
                height: 150,
                overflow: 'hidden'
              }}
            >
              <Typography variant="h5" mb={4} color="text.secondary" fontWeight="600">搜索</Typography>
              <MobileSearchInput
                onBlur={onBlur}
                onFocus={onFocus}
                keyword={keyword}
                onKeyPress={onKeyPress}
                value={input}
                onInput={onInput}
              />
            </AppBar>
          </>
        )
      }
      <PageLayout
        sx={{
          ...(isMobile && ({ pt: 0 }))
        }}
      >
        {
          ({ pt }: LayoutData) => (
            <>
              <Head>
                <title>Melody - 搜索</title>
              </Head>

              {
                !isMobile && (
                  <>
                    <Container
                      disableGutters
                      maxWidth="md"
                      sx={{
                        mt: 4,
                        position: 'sticky',
                        top: (theme: Theme) => theme.spacing(4 + pt),
                        zIndex: 99

                      }}
                    >
                      <Box style={{ position: 'relative' }}>
                        <SearchInput
                          value={input}
                          onInput={onInput}
                          keyword={keyword}
                          onBlur={onBlur}
                          onFocus={onFocus}
                          onClearClick={onClearClick}
                          onKeyPress={onKeyPress}
                        />

                        <Grow in={Boolean(inputFocus && formatInput)}>

                          <Box
                            sx={{
                              position: 'absolute',
                              top: 50,
                              left: 0,
                              width: '100%'
                            }}
                          >
                            {suggestions}
                          </Box>
                        </Grow>

                      </Box>
                    </Container>
                  </>
                )
              }


              <Container maxWidth="lg" sx={{ mb: 6 }} disableGutters>

                {
                  keyword ? (
                    <>
                      <Box
                        mt={isMobile ? 0 : 7}
                        sx={{
                          borderBottom: 1, borderColor: 'divider',
                          position: isMobile ? 'sticky' : 'unset',
                          top: 150,
                          zIndex: 200,
                          bgcolor: 'background.default',
                          pt: isMobile ? 2 : 0
                        }}
                      >
                        <Tabs
                          scrollButtons="auto"
                          value={tab}
                          onChange={handleChange}
                          textColor="inherit"
                          centered={!isMobile}
                          sx={{
                            minHeight: isMobile ? 30 : 48
                          }}
                        >
                          <Tab
                            label="单曲"
                            sx={{
                              width: isMobile ? 'unset' : 100,
                              py: isMobile ? 0 : 2,
                              minWidth: 'unset',
                              minHeight: 'unset'
                            }}
                          />
                          <Tab
                            label="歌手" sx={{
                            width: isMobile ? 'unset' : 100,
                            py: isMobile ? 0 : 2,
                            minWidth: 'unset',
                            minHeight: 'unset'
                          }}
                          />
                          <Tab
                            label="专辑" sx={{
                            width: isMobile ? 'unset' : 100,
                            py: isMobile ? 0 : 2,
                            minWidth: 'unset',
                            minHeight: 'unset'
                          }}
                          />
                          <Tab
                            label="歌单" sx={{
                            width: isMobile ? 'unset' : 100,
                            py: isMobile ? 0 : 2,
                            minWidth: 'unset',
                            minHeight: 'unset'
                          }}
                          />
                          <Tab
                            label="MV" sx={{
                            width: isMobile ? 'unset' : 100, px: isMobile ? 1.5 : 1.5,
                            py: isMobile ? 0 : 2,
                            minWidth: 'unset',
                            minHeight: 'unset'
                          }}
                          />
                        </Tabs>
                      </Box>

                      <SwipeableViews
                        axis="x"
                        index={tab}

                      >
                        <TabPanel value={tab} index={0} dir="x">
                          <Songs input={keyword} isMobile={isMobile}/>
                        </TabPanel>

                        <TabPanel value={tab} index={1} dir="x">
                          <Singer input={keyword} />
                        </TabPanel>

                        <TabPanel value={tab} index={2} dir="x">
                          <Album input={keyword} isMobile={isMobile}/>
                        </TabPanel>

                        <TabPanel value={tab} index={3} dir="x">
                          <Playlist input={keyword} isMobile={isMobile}/>
                        </TabPanel>

                        <TabPanel value={tab} index={4} dir="x">
                          <Mv input={keyword} isMobile={isMobile}/>
                        </TabPanel>
                      </SwipeableViews>
                    </>
                  ) : <HotSearchWord isMobile={isMobile} onClick={handleHotSearchWordClick} />
                }

              </Container>

              <Fade in={Boolean(inputFocus && formatInput && !isMobile)} unmountOnExit>

                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bgcolor: (theme: Theme) => alpha(theme.palette.background.default, 0.5),
                    backdropFilter: 'blur(10px)'

                  }}
                />
              </Fade>

            </>
          )
        }
      </PageLayout>
    </>
  );
};

export default Search;

export async function getStaticProps() {
  return {
    props: {
      hideHeaderBar: true
    }
  };
}
