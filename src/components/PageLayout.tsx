import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import { Box, Container, Breakpoint, SxProps } from '@mui/material';
import useMediaQueryKey from '../hooks/useMediaQueryKey';
import { getIsMobile } from '../utils/utils';


type PageLayoutProps = {
  children: ReactNode
  sx?: SxProps
}

export type LayoutData = {
  pt: { xs: number, md: number }
  pb: { xs: number, md: number },
  maxWidth: Breakpoint
}

const layoutData: LayoutData = {
  pt: { xs: 3, md: 6 },
  pb: { xs: 2, md: 2 },
  maxWidth: 'xl'
};

function PageLayout(props: PageLayoutProps) {
  const { children, sx } = props;

  const key = useMediaQueryKey();
  const isMobile = getIsMobile(key);

  const pObj = useMemo(() => ({
    pt: isMobile ? layoutData.pt.xs : layoutData.pt.md,
    pb: isMobile ? layoutData.pb.xs : layoutData.pt.md
  }), [isMobile]);

  const node = typeof children === 'function' ? children({ ...layoutData, ...pObj }) : children;

  return (

    <Container maxWidth={layoutData.maxWidth} sx={{ px: { xs: 1, md: 2 } }}>
      <Box
        sx={{
          ...pObj,
          ...sx
        }}
      >
        {node}
      </Box>
    </Container>

  );
}

export default PageLayout;