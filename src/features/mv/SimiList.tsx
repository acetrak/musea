import { Fragment, useMemo,memo } from 'react';
import useSWR from 'swr';
import { get } from 'lodash';
import { List } from '@mui/material';

import { mvListItem } from '../search/Mv';
import SimiCard, { SimiCardSkeleton } from './SimiCard';


type SimiListProps = {
  mvId: number
}

function SimiList(props: SimiListProps) {

  const { mvId } = props;
  const { data, error } = useSWR(`/simi/mv?mvid=${mvId}`);

  const loadingSimi = useMemo(() => !data && !error, [data, error]);

  const simiMvs: Array<mvListItem> = get(data, 'mvs', []);

  return (
    <>
      {
        loadingSimi ? [0, 1, 2, 3, 4].map((o) => (
          <SimiCardSkeleton key={o} />
        )) : null
      }

      <List sx={{ width: '100%', padding: 0 }}>
        {
          simiMvs.map((item) => (
            <Fragment key={item.id}>
              <SimiCard item={item} />
            </Fragment>
          ))
        }
      </List>
    </>
  );
}

export default memo(SimiList);