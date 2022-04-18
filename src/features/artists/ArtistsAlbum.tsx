import { Box, ImageList, ImageListItem, Skeleton, TablePagination } from '@mui/material';
import useSWR from 'swr';
import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { useMemo } from 'react';

import { AlbumCard } from '../../components';
import { AlbumsItem } from '../../components/AlbumCard';
import { fetcher } from '../../utils/utils';
import { bindActionCreators, Dispatch } from 'redux';
import { setPage, setRowsPerPage } from '../../store/artists/action';
import useMediaQueryKey from '../../hooks/useMediaQueryKey';

export function defaultLabelDisplayedRows({ from, to, count }: { from: number, to: number, count: number }) {
  return `${from}–${to} 共 ${count !== -1 ? `${count}张` : `超过 ${to}首`}`;
}

type ArtistsAlbumProps = {
  value?: number
  artistId: number
}


function ArtistsAlbum(props: ArtistsAlbumProps) {


  // @ts-ignore
  const { artistId, rowsPerPage, setRowsPerPage, page, setPage } = props;

  // const { data } = useSWR(value === 2 ? () => ('/artist/album?id=' + artistId + '&limit=500') : null, fetcher);
  const { data } = useSWR(('/artist/album?id=' + artistId + '&limit=500'), fetcher);

  const albums: AlbumsItem[] = get(data, 'hotAlbums', []);

  const key = useMediaQueryKey();

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


  const var_albums: AlbumsItem[] = React.useMemo(() => albums.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [
    albums, page, rowsPerPage
  ]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };

  if (!data) return (

    <ImageList cols={cols} gap={30}>
      {
        [0, 1, 2, 3, 4, 5].map((_, index) => (
          <ImageListItem key={index}>
            <Skeleton sx={{ borderRadius: 1.5 }} animation="wave" variant="rectangular" height={220} />
          </ImageListItem>
        ))
      }
    </ImageList>

  );
  return (
    <>


      <Box>

        <ImageList cols={cols} gap={30}>
          {var_albums.map((item) => (
            <ImageListItem key={item.id}>
              <AlbumCard album={item} />
            </ImageListItem>
          ))}
        </ImageList>

        <Box py={2}>
          <TablePagination
            showFirstButton
            showLastButton
            labelRowsPerPage="每页"
            labelDisplayedRows={defaultLabelDisplayedRows}
            rowsPerPageOptions={[12, 30, 60]}
            component="div"
            count={albums.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
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

const Comp = connect(mapStateToProps, mapDispatchToProps)(ArtistsAlbum);
export default React.memo(Comp);