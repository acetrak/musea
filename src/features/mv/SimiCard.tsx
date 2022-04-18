import * as React from 'react';
import { Box, CardActionArea, ListItem, ListItemAvatar, ListItemText, Skeleton, Typography } from '@mui/material';
import { Image, Link } from '../../components';
import { mvListItem } from '../search/Mv';
import { millisecond2Minute } from '../../utils/utils';

type SimiCardProps = {
  item: mvListItem
}

export const SimiCardSkeleton = () => {
  return (

    <Box sx={{ mb: 2 }}>
      <ListItem
        sx={{ p: 0, fontSize: 0, m: 0 }}
        alignItems="flex-start"
      >
        <Skeleton variant="rectangular" width={160} height={100} animation="wave" />
        <Box sx={{ flex: 1, ml: 2 }}>
          <Skeleton sx={{ mb: 2, mt: 1 }} variant="rectangular" width="60%" height={16} animation="wave" />
          <Skeleton sx={{ mb: 1.5 }} variant="rectangular" width="40%" height={14} animation="wave" />
          <Skeleton sx={{ mb: 1 }} variant="rectangular" width="20%" height={12} animation="wave" />
        </Box>
      </ListItem>
    </Box>
  );
};

function SimiCard(props: SimiCardProps) {

  const { item } = props;

  return (

    <>
      <CardActionArea
        component={Link} href={`/mv/[id]`} linkAs={`/mv/${item.id}`}
      >
        <ListItem
          sx={{ p: 0, fontSize: 0, m: 0 }}
          alignItems="flex-start"
        >
          <ListItemAvatar sx={{ m: 0, mr: 2, position: 'relative' }}>
            <Image alt={item.name} src={item.cover} width={160} height={100} />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                right: 4,
                bottom: 4,
                backgroundColor: 'rgba(0,0,0,0.7)',
                px: 1
              }}
            >
              {millisecond2Minute(item.duration)}
            </Typography>
          </ListItemAvatar>
          <ListItemText
            sx={{ m: 0 }}
            primary={
              <React.Fragment>
                <Typography
                  variant="body1"
                  className="nowrap2"
                  color="text.primary"
                >
                  {item.name}
                </Typography>
              </React.Fragment>
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
                  {item.artistName}
                </Typography>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  className="nowrap2"
                >
                  {item.playCount}次播放
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>

      </CardActionArea>
      <div style={{ paddingBottom: 12 }} />

    </>
  );

}

export default React.memo(SimiCard);