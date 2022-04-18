import { createTheme } from '@mui/material';
import { zhCN } from '@mui/material/locale';
import { cyan, grey } from '@mui/material/colors';

const darkTheme = createTheme({

  palette: {
    mode: 'dark',
    primary: {
      main: '#25bc7c'
    },
    background: {
      default: '#080808',
      paper: '#151515'

    },
    text: {
      primary: grey['300']
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
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          color: '#fff',
          backgroundColor: cyan['700']
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
    primary: {
      main: '#25bc7c',
      // main: '#f50057'
    },
    background: {
      paper: '#f5f5f5'
    },
    text: {
      primary: grey['900']
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
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          color: '#000',
          backgroundColor: cyan['700']
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