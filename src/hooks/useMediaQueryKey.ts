import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function useMediaQueryKey(): Breakpoint {
  const theme = useTheme();
  const keys = [...theme?.breakpoints.keys].reverse();

  return (
    // @ts-ignore
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme?.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || null
  );
}



