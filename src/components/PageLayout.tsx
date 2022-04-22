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
  pt: number
  pb: number,
  maxWidth: Breakpoint
}

const defaultData = {
  pt: { xs: 3, md: 6 },
  pb: { xs: 2, md: 2 },
  maxWidth: 'xl' as Breakpoint
};

function PageLayout(props: PageLayoutProps) {
  const { children, sx } = props;

  const key = useMediaQueryKey();
  const isMobile = getIsMobile(key);

  const pObj = useMemo(() => ({
    pt: isMobile ? defaultData.pt.xs : defaultData.pt.md,
    pb: isMobile ? defaultData.pb.xs : defaultData.pt.md
  }), [isMobile]);

  const node = typeof children === 'function' ? children({ ...defaultData, ...pObj }) : children;

  return (

    <Container maxWidth={defaultData.maxWidth} disableGutters sx={{ px: { xs: 1, md: 4 },pb:6 }}>
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