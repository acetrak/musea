import * as React from 'react';
import { Chip, Stack } from '@mui/material';

type MobileTabsProps = {
  items: string[]
  onChange?: (e: any, value: number) => void
  value: number
  textColor?: string
}

function MobileTabs(props: MobileTabsProps) {
  const { items, value, textColor, onChange } = props;

  return (
    <>
      <Stack direction="row" spacing={1}>
        {
          items.map((o: string, i: number) => (
            <Chip
              onClick={(e: any) => onChange?.(e, i)}
              clickable
              key={i}
              label={o}
              variant={i === value ? 'filled' : 'outlined'}
              color="primary"
              sx={{
                color: i === value ? textColor : 'text.primary'
              }}
            />
          ))
        }
      </Stack>
    </>
  );
}

export default MobileTabs;