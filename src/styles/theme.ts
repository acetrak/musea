import { createTheme, responsiveFontSizes as muiResponsiveFontSizes, Theme } from '@mui/material';
import { zhCN } from '@mui/material/locale';
import { grey } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }

  // 允许配置文件使用 `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const responsiveFontSizes = (theme: Theme) => {


  // theme.typography.h2 = {
  //   ...theme.typography.h2,
  //   fontSize: '1.75rem',
  //   [theme.breakpoints.up('md')]: {
  //     fontSize: '2.75rem'
  //   }
  // };
  //
  // theme.typography.h5 = {
  //   ...theme.typography.h5,
  //   fontSize: '1.2rem',
  //   [theme.breakpoints.up('md')]: {
  //     fontSize: '1.5rem'
  //   }
  // };
  theme.typography.h6 = {
    ...theme.typography.h6,
    fontSize: '1.1rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem'
    }
  };
  theme.typography.subtitle1 = {
    ...theme.typography.subtitle1,
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem'
    }
  };
  theme.typography.subtitle2 = {
    ...theme.typography.subtitle2,
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '0.875rem'
    }
  };
  theme.typography.body1 = {
    ...theme.typography.body1,
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem'
    }
  };
  theme.typography.body2 = {
    ...theme.typography.body2,
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '0.875rem'
    }
  };
  theme.typography.caption = {
    ...theme.typography.caption,
    fontSize: '0.6rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '0.75rem'
    }
  };
  return muiResponsiveFontSizes(theme);
};

const common = {
  palette: {
    primary: {
      main: '#26974d'
      // main: '#4b6dca'
    }
  },
  typography: {
    fontFamily: `'Noto Sans SC', sans-serif`,
    h1: {
      fontSize: '3rem'
    },
    h2: {
      fontSize: '2.5rem'
    },
    h3: {
      fontSize: '2rem'
    },
    h4: {
      fontSize: '1.725rem'
    },
    body2: {
      lineHeight: 1.9
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }
  }
};

const darkTheme = createTheme({

  palette: {
    mode: 'dark',
    primary: common.palette.primary,
    background: {
      default: '#080808',
      paper: '#151515'

    },
    text: {
      primary: grey['300']
    }
  },
  typography: common.typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          color: '#fff',
          backgroundColor: common.palette.primary.main
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#151515'
        }
      }
    }
  }
}, zhCN);


const lightTheme = createTheme({

  palette: {
    mode: 'light',
    primary: common.palette.primary,
    background: {
      paper: '#f5f5f5'
    },
    text: {
      primary: grey['900']
    }
  },
  typography: common.typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          color: '#000',
          backgroundColor: common.palette.primary.main
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }

  }
}, zhCN);

export {
  darkTheme,
  lightTheme
};