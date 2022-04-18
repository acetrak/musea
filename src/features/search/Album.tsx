import * as React from 'react';
import useSWR from 'swr';
import { Box, ImageList, ImageListItem, TablePagination } from '@mui/material';
import { get } from 'lodash';

import { fetcher } from '../../utils/utils';
import Error from './Error';
import Loading from './Loading';
import ResultTip from './ResultTip';
import { AlbumCard } from '../../components';
import { AlbumsItem } from '../../components/AlbumCard';

import { defaultLabelDisplayedRows } from '../artists/ArtistsAlbum';


type AlbumProps = {
  input?: string
}
type AlbumItem = AlbumsItem

const TYPE = 10;

const Album = (props: AlbumProps) => {

  const { input } = props;
  const { data, error } = useSWR(input ? () => `/cloudsearch?keywords=${input}&type=${TYPE}&limit=100` : null, fetcher);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);

  const albums: Array<AlbumItem> = get(data, 'result.albums', []);

  const page_albums: AlbumsItem[] = React.useMemo(() => albums.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [
    albums, page, rowsPerPage
  ]);


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

  console.log('Album',page_albums);

  return (
    <>
      <ImageList cols={3} gap={30}>
        {page_albums.map((item) => (
          <ImageListItem key={item.id}>
            <AlbumCard

              album={item}

            />
          </ImageListItem>
        ))}
      </ImageList>
      <ResultTip loading={loading} hasData={!!albums.length} error={error} />
      {
        albums.length ? (
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
        ) : null
      }

    </>
  );

};

export default React.memo(Album);