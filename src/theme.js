import { createTheme } from '@material-ui/core/styles';
import PauseIcon from './assets/pause.svg';

import Campton from '../public/static/fonts/camptonBook.woff';
import CamptonMedium from '../public/static/fonts/camptonMedium.woff';
import CamptonSemiBold from '../public/static/fonts/CamptonSemiBold.woff';

const campton = {
  fontFamily: 'Campton',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    url(${Campton}) format('woff'),
    url(${CamptonMedium}) format('woff')
  `,
};

const camptonSemiBold = {
  fontFamily: 'Campton SemiBold',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  src: `
    url(${CamptonSemiBold}) format('woff')
  `,
};

const theme = createTheme({
  palette: {
    text: {
      primary: '#4E4E51',
      // NOTE: below is the transformed color from design #44687C with opacity 0.6
      secondary: '#8fa4b0',
    },
    primary: {
      main: '#FFAE00',
      dark: '#FF9A00',
      contrastText: '#fff',
    },
    secondary: {
      main: '#001C5E',
    },
    error: {
      main: '#FD151B',
    },
  },
  typography: {
    fontFamily: 'Campton, Roboto, Arial',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [campton, camptonSemiBold],
      },
    },
    MuiButton: {
      contained: {
        '&$disabled': {
          opacity: 0.5,
          border: '1px solid #001C5E',
          backgroundColor: '#fff',
          color: '#001C5E',
        },
      },
      root: {
        borderRadius: 5,
        '&$disabled': {
          opacity: 0.5,
          border: '1px solid #001C5E',
          backgroundColor: '#fff',
          color: '#001C5E',
        },
      },
    },
    MuiSwitch: {
      root: {
        width: 80,
        height: 42,
        borderRadius: 80,
        padding: 0,
        border: '1px solid #D5DDE2',
        '&$checked': {},
      },
      switchBase: {
        padding: 1,
        '&$checked': {
          transform: 'translateX(38px)',
          color: '#fff',
          '& + $track': {
            backgroundColor: '#F5F7F8',
            opacity: 1,
            border: 'none',
          },
        },
        '&$thumb': {
          color: '#fff',
        },
      },
      thumb: {
        width: 38,
        height: 36,
        border: '2px solid rgba(68, 104, 124, 0.2)',
        boxSizing: 'border-box',
        boxShadow: '0px 3px 4px rgba(66, 90, 103, 0.3)',
        backgroundImage: `url(${PauseIcon})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '30%',
        backgroundPosition: 'center',
      },
      track: {
        backgroundColor: '#fff',
        opacity: 1,
      },
      checked: {},
    },
    MuiPaper: {
      elevation2: {
        boxShadow: '0px 1px 5px rgba(66, 90, 103, 0.5)',
      },
      elevation3: {
        boxShadow: '0px 25px 50px rgba(66, 90, 103, 0.25)',
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#fff',
      },
      root: { boxShadow: 'none' },
    },
    MuiTypography: {
      h5: {
        fontSize: '1.375rem',
      },
    },
    MuiInputLabel: {
      shrink: {
        transform: 'none',
      },
      root: {
        position: 'relative',
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: '#E6E9EF',
        padding: '10px 15px',
        color: '#4E4E51',
      },
    },
    MuiSlider: {
      markLabelActive: {
        color: 'none',
      },
      markLabel: {
        top: 32,
      },
      root: {
        color: '#FD151B',
        height: 3,
        marginTop: 30,
        marginBottom: 10,
        padding: '13px 0',
        '&$disabled': {
          '& .MuiSlider-thumb': {
            width: 28,
            height: 28,
            marginTop: -14,
            marginLeft: -14,
          },
        },
      },
      thumb: {
        height: 25,
        width: 25,
        backgroundColor: '#fff',
        border: '2px solid #FD151B',
        marginTop: -11,
        marginLeft: -13,
        boxShadow: '#ebebeb 0px 2px 2px',
        backgroundImage: `url(${PauseIcon})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '30%',
        backgroundPosition: 'center',
        '&:focus,&:hover,&$active': {
          boxShadow: '#ccc 0px 2px 3px 1px',
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 4px)',
      },
      track: {
        height: 3,
        backgroundColor: '#FD151B',
      },
      rail: {
        color: '#dad8d4',
        opacity: 1,
        height: 3,
      },
      mark: {
        backgroundColor: '#bfbfbf',
        height: 15,
        width: 2,
        marginTop: -7.5,
      },
      markActive: {
        opacity: 1,
        backgroundColor: '#bfbfbf',
      },
    },
    MuiBadge: {
      anchorOriginTopRightRectangular: {
        right: -20,
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        '&$expanded': {
          minHeight: 24,
        },
      },
      content: {
        '&$expanded': {
          margin: 0,
        },
      },
    },
    MuiFilledInput: {
      adornedEnd: {
        paddingRight: 0,
      },
    },
    MuiOutlinedInput: {
      root: {
        borderColor: '#001C5E',
      },
      adornedEnd: {
        paddingRight: 0,
      },
    },
    MuiFormLabel: {
      root: {
        color: '#001C5E',
        '&$focused': {
          color: '#001C5E',
        },
      },
    },
  },
});

export default theme;
