import * as React from 'react';
import useSWR from 'swr';
import { get } from 'lodash';
import { CardActionArea, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';


import { Image, Link } from '../../components';
import Loading from './Loading';
import ResultTip from './ResultTip';

type SingerProps = {
  input?: string
  tabValue?: number
}

const TYPE = 100;

type SingerItem = {
  alias: string[]
  name: string
  picUrl: string
  accountId: number
  id: number
}
const Singer = (props: SingerProps) => {

  const { input } = props;
  const { data, error } = useSWR(input ? () => `/cloudsearch?keywords=${input}&type=${TYPE}&limit=100` : null);


  const artists: Array<SingerItem> = get(data, 'result.artists', []);

  console.log('Singer');

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
          artists.map((item, index) => (
            <CardActionArea
              key={item.id} component={Link} href={`/artists/[id]`} linkAs={`/artists/${item.id}?tab=songs`}
            >
              <ListItem
                alignItems="flex-start"
              >
                <ListItemAvatar sx={{ borderRadius: 1, overflow: 'hidden', mr: 2 }}>
                  <Image alt={item.name} src={item.picUrl} width={60} height={60} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.alias.join(',')}
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
      <ResultTip loading={loading} hasData={!!artists.length} error={error} />
    </>
  );

};

export default React.memo(Singer);