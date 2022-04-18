import * as React from 'react';
import { ReactNode } from 'react';
import { Box, Container, Breakpoint, SxProps } from '@mui/material';


type PageLayoutProps = {
  children: ReactNode
  sx?: SxProps
}

export type LayoutData = {
  pt: number
  pb: number,
  maxWidth: Breakpoint
}

const layoutData: LayoutData = {
  pt: 6,
  pb: 2,
  maxWidth: 'xl'
};

function PageLayout(props: PageLayoutProps) {
  const { children, sx } = props;

  const node = typeof children === 'function' ? children(layoutData) : children;

  return (

    <Container maxWidth={layoutData.maxWidth}>
      <Box pt={layoutData.pt} pb={layoutData.pb} sx={sx}>
        {node}
      </Box>
    </Container>

  );
}

export default PageLayout;