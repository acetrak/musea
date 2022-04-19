import * as React from 'react';
import useSWR from 'swr';
import { get } from 'lodash';
import {
  Box,
  CardActionArea,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TablePagination,
  Typography
} from '@mui/material';

import { Image, Link } from '../../components';
import Loading from './Loading';

import { defaultLabelDisplayedRows } from '../artists/ArtistsAlbum';
import { fetcher } from '../../utils/utils';
import ResultTip from './ResultTip';


type PlaylistProps = {
  input?: string
  isMobile?: boolean
}

type PlaylistItem = {
  coverImgUrl: string
  description: string
  name: string
  id: number
  playCount: number
  trackCount: number
}

const TYPE = 1000;

const Playlist = (props: PlaylistProps) => {

  const { input ,isMobile} = props;

  const { data, error } = useSWR(input ? () => `/cloudsearch?keywords=${input}&type=${TYPE}&limit=100` : null, fetcher);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);

  const playlist: Array<PlaylistItem> = get(data, 'result.playlists', []);

  const page_playlist: PlaylistItem[] = React.useMemo(() => playlist.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [
    playlist, page, rowsPerPage
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

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper', padding: 0 }}>
        {
          page_playlist.map((item, index) => (
            <CardActionArea
              key={item.id} component={Link} href={`/playlist/[id]`} linkAs={`/playlist/${item.id}`}
            >
              <ListItem
                alignItems="flex-start"
              >
                <ListItemAvatar sx={{ borderRadius: 2, overflow: 'hidden', mr: 2 }}>
                  <Image alt={item.name} src={`${item.coverImgUrl}?parma=130y130`} width={isMobile?64:130} height={isMobile?64:130} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <Typography
                        variant={isMobile?'subtitle1':'h6'}
                        className="nowrap1"
                      >
                        {item.name}
                      </Typography>
                    </>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        className="nowrap2"
                      >
                        {item.description}
                      </Typography>

                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider />
            </CardActionArea>
          ))
        }

      </List>
      <ResultTip loading={loading} hasData={!!page_playlist.length} error={error} />

      {
        page_playlist.length ? (
          <Box py={2}>
            <TablePagination
              showFirstButton={!isMobile}
              showLastButton={!isMobile}
              labelRowsPerPage="每页"
              labelDisplayedRows={defaultLabelDisplayedRows}
              rowsPerPageOptions={[12, 30, 60]}
              component="div"
              count={playlist.length}
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

export default React.memo(Playlist);