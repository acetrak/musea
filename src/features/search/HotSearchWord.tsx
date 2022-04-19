import * as React from 'react';
import useSWR from 'swr';
import { get, slice } from 'lodash';
import { Paper, Container, Grid, CircularProgress, CardActionArea, Typography, Stack, Chip } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

import { fetcher, formatNumToTenThousand } from '../../utils/utils';
import { useCallback } from 'react';

type HotSearchWordProps = {
  onClick?: (word: string) => void
  isMobile?: boolean
}

type Word = {
  searchWord: string
  score: number
  content: string
  iconUrl: string
}

const WordItem = (props: { item: Word, index: number, onClick: (word: string) => void }) => {
  const { item, index, onClick } = props;

  const click = useCallback(() => {
      onClick(item.searchWord);
    }, [item.searchWord, onClick]
  );
  return (
    <CardActionArea onClick={click}>
      <Stack flexDirection="row" alignItems="center" sx={{ py: 1, px: 2 }}>
        <Typography variant="body2">
          {item.searchWord}
        </Typography>
        <Stack flexDirection="row" alignItems="center" sx={{ ml: 'auto' }}>
          {
            index < 3 && (
              <LocalFireDepartmentIcon sx={{ color: 'grey.600', fontSize: 14, mr: 0.4 }} />
            )
          }
          <Typography variant="caption" color="grey.600">
            {formatNumToTenThousand(item.score)}
          </Typography>
        </Stack>
      </Stack>
    </CardActionArea>

  );
};

function HotSearchWord(props: HotSearchWordProps) {

  const { onClick, isMobile } = props;

  const { data, error } = useSWR(`/search/hot/detail`, fetcher);

  const loading = Boolean(!error && !data);

  const words: Array<Word & { _index: number }> = get(data, 'data', []).map((o: Word, index: number) => ({
    ...o,
    _index: index
  }));

  const before = slice(words, 0, 10);
  const after = slice(words, 10, words.length);

  const handleClick = useCallback((word: string) => {
    if (typeof onClick === 'function')
      onClick(word);
  }, [onClick]);


  return (
    <>
      <Container
        disableGutters
        maxWidth="md" sx={{
        py: 5
      }}
      >
        <Typography variant="body1" my={isMobile ? 0 : 4} color="grey.500">热搜</Typography>

        {
          loading && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 2 }}>
              <CircularProgress size={24} />
            </Stack>
          )
        }

        {
          error && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 2 }}>
              <Typography variant="body1" color="grey.500">加载出错</Typography>
            </Stack>
          )
        }


        {
          isMobile ? (

            <>
              <Stack direction="row" flexWrap="wrap" mt={2}>
                {
                  words.map(item => (
                    <Chip
                      icon={item._index < 3 ? <LocalFireDepartmentIcon fontSize="small" /> : undefined}
                      sx={{ mr: 1, mb: 1 }}
                      size="small"
                      key={item._index}
                      label={item.searchWord}
                      clickable
                    />
                  ))
                }
              </Stack>

            </>
          ) : (

            <Grid container spacing={6}>

              <Grid item md={6} lg={6} sm={12} xs={12}>
                <Paper>
                  {
                    before.map(item => (
                      <WordItem onClick={handleClick} index={item._index} key={item.searchWord} item={item} />
                    ))
                  }
                </Paper>
              </Grid>
              <Grid item md={6} lg={6} sm={12} xs={12}>
                <Paper>
                  {
                    after.map(item => (
                      <WordItem onClick={handleClick} index={item._index} key={item.searchWord} item={item} />
                    ))
                  }
                </Paper>
              </Grid>
            </Grid>

          )
        }

      </Container>

    </>
  );


}

export default HotSearchWord;