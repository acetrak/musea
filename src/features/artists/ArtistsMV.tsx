import { Box, ImageList, ImageListItem, Skeleton, TablePagination, Typography } from '@mui/material';
import useSWR from 'swr';
import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { useMemo } from 'react';

import { fetcher, getIsMobile } from '../../utils/utils';
import { bindActionCreators, Dispatch } from 'redux';
import { setPage, setRowsPerPage } from '../../store/artists/action';
import MvCard from '../../components/MvCard';
import useMediaQueryKey from '../../hooks/useMediaQueryKey';
import { SkeletonCard } from '../mv-collect/PersonalizedCard';

export function defaultLabelDisplayedRows({ from, to, count }: { from: number, to: number, count: number }) {
  return `${from}–${to} 共 ${count !== -1 ? `${count}首` : `超过 ${to}首`}`;
}

type MVsItem = {

  imgurl: string
  imgurl16v9: string
  artist: {
    id: number,
    name: string
  }
  artistName: string
  name: string
  playCount: number
  duration: number
  id: number
  publishTime?: string
}

type ArtistsAlbumProps = {
  value?: number
  artistId: number
}


function ArtistsMV(props: ArtistsAlbumProps) {


  // @ts-ignore
  const { artistId, rowsPerPage, setRowsPerPage, page, setPage } = props;

  const { data } = useSWR(('/artist/mv?id=' + artistId + '&limit=500'), fetcher);


  const mvs: MVsItem[] = get(data, 'mvs', []);

  const key = useMediaQueryKey();

  const isMobile = getIsMobile(key);

  const cols = useMemo(() => {
    switch (key) {
      case 'xl':
        return 4;
      case 'lg':
        return 4;
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

  const var_mvs: MVsItem[] = React.useMemo(() => mvs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [
    mvs, page, rowsPerPage
  ]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };

  if (!data) return (

    <ImageList cols={cols} gap={isMobile ? 10 : 30}>
      {
        [0, 1, 2, 3, 4, 5,6,7].map((_, index) => (
          <ImageListItem key={index}>
            <SkeletonCard />
          </ImageListItem>
        ))
      }
    </ImageList>

  );
  return (
    <>

      <Box>

        <ImageList cols={cols} gap={isMobile ? 10 : 30}>
          {var_mvs.map((item) => (
            <ImageListItem key={item.id}>
              <MvCard mv={item} />
            </ImageListItem>
          ))}
        </ImageList>

        {
          mvs.length ? (
            <Box py={2}>
              <TablePagination
                size="small"
                showFirstButton={!isMobile}
                showLastButton={!isMobile}

                labelRowsPerPage="每页"
                labelDisplayedRows={defaultLabelDisplayedRows}
                rowsPerPageOptions={[12, 30, 60]}
                component="div"
                count={mvs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          ) : <Typography variant="body1" align="center" color="text.secondary" py={3}>暂无数据</Typography>
        }

      </Box>
    </>
  );

}

const mapStateToProps = (state: any) => {
  return {
    rowsPerPage: state.artists.rowsPerPage,
    page: state.artists.page
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPage: bindActionCreators(setPage, dispatch),
    setRowsPerPage: bindActionCreators(setRowsPerPage, dispatch)

  };
};

const Comp = connect(mapStateToProps, mapDispatchToProps)(ArtistsMV);
export default React.memo(Comp);