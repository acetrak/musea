import * as React from 'react';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';


type  SquareFillTabsProps={
  items:string[]
  value:number
  onChange:(e:any,value:number)=>void
}
function SquareFillTabs(props:SquareFillTabsProps) {

  const {items,value,onChange} = props

  return (
    <>

      <Tabs
        centered
        onChange={onChange}
        value={value}
        sx={{
          minHeight: 'unset',
          minWidth: 'unset',
          zIndex: 12,
          p: 0,
          '& .MuiTabs-indicator': {
            height: '100%',
            zIndex: 1,
            borderRadius: 1
          },
          '& .Mui-selected': {
            color: '#fff'
          }
        }}
      >
        {
          items.map(o => (
            <Tab
              sx={{
                minHeight: 'unset',
                px: 2.5,
                py: 1,
                minWidth: 'unset',
                position: 'relative',
              }}
              label={o}
              key={o}
            />
          ))
        }

      </Tabs>

    </>
  );
}

export default React.memo(SquareFillTabs);