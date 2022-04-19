import * as React from 'react';
import useSWR from 'swr';
import { get } from 'lodash';
import { Box, ImageList, ImageListItem, TablePagination } from '@mui/material';
import { MvCard } from '../../components';
import Loading from './Loading';

import { fetcher } from '../../utils/utils';
import { defaultLabelDisplayedRows } from '../artists/ArtistsAlbum';
import ResultTip from './ResultTip';
import useMediaQueryKey from '../../hooks/useMediaQueryKey';
import { useMemo } from 'react';


type MvProps = {
  input?: string
  isMobile?: boolean
}
export type mvListItem = {
  cover: string
  artists: Array<{
    id: number,
    name: string
  }>
  artistName: string
  name: string
  playCount: number
  duration: number
  desc: string
  briefDesc: string
  id: number
}

const TYPE = 1004;
const Mv = (props: MvProps) => {


  const { input, isMobile } = props;

  const { data, error } = useSWR(input ? () => `/cloudsearch?keywords=${input}&type=${TYPE}&limit=100` : null, fetcher);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);

  const mvList: Array<mvListItem> = get(data, 'result.mvs', []);

  const page_mvList: mvListItem[] = React.useMemo(() => mvList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [
    mvList, page, rowsPerPage
  ]);

  const key = useMediaQueryKey();

  const cols = useMemo(() => {
    switch (key) {
      case 'xl':
        return 3;
      case 'lg':
        return 3;
      case 'md':
        return 3;
      case 'sm':
        return 2;
      case 'xs':
        return 2;
      default:
        return 2;
    }
  }, [key]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };


  const loading = Boolean(!error && !data && input);

  if (loading) {
    return (
      <Loading />
    );
  }


  return (
    <>
      <ImageList cols={cols} gap={isMobile ? 8 : 30}>
        {page_mvList.map((item) => (
          <ImageListItem key={item.id}>
            <MvCard mv={item} />
          </ImageListItem>
        ))}
      </ImageList>
      <ResultTip loading={loading} hasData={!!mvList.length} error={error} />
      {
        mvList.length ? (
          <Box py={2}>
            <TablePagination
              showFirstButton={!isMobile}
              showLastButton={!isMobile}
              labelRowsPerPage="每页"
              labelDisplayedRows={defaultLabelDisplayedRows}
              rowsPerPageOptions={[12, 30, 60]}
              component="div"
              count={mvList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        ) : null
      }

    </>
  );

};

export default React.memo(Mv);