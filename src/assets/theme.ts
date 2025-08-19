import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#1976d2' } },
  typography: {
    fontFamily: 'Carlito, Arial, Calibri, Roboto, sans-serif',
    h1: { color: '#222', fontWeight: 700 },
    h2: { color: '#222', fontWeight: 700 },
    h3: { color: '#222', fontWeight: 700 },
    body1: { color: '#333' },
    body2: { color: '#444' },
    button: { color: '#fff', fontWeight: 600 },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#212121' },
    secondary: { main: '#01060aff' },
    background: { default: '#181818', paper: '#232323' },
    text: { primary: '#fff', secondary: '#bb3b3bff' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { color: '#fff', fontWeight: 700 },
    h2: { color: '#fff', fontWeight: 700 },
    h3: { color: '#fff', fontWeight: 700 },
    body1: { color: '#eee' },
    body2: { color: '#ccc' },
    button: { color: '#fff', fontWeight: 600 },
  },
});

export const blueTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#1976d2' }, secondary: { main: '#90caf9' } },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { color: '#1976d2', fontWeight: 700 },
    h2: { color: '#1976d2', fontWeight: 700 },
    h3: { color: '#1976d2', fontWeight: 700 },
    body1: { color: '#333' },
    body2: { color: '#444' },
    button: { color: '#fff', fontWeight: 600 },
  },
});

export const greenTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#43a047' }, secondary: { main: '#a5d6a7' } },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { color: '#43a047', fontWeight: 700 },
    h2: { color: '#43a047', fontWeight: 700 },
    h3: { color: '#43a047', fontWeight: 700 },
    body1: { color: '#333' },
    body2: { color: '#444' },
    button: { color: '#fff', fontWeight: 600 },
  },
});

export const purpleTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#8e24aa' }, secondary: { main: '#ce93d8' } },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { color: '#8e24aa', fontWeight: 700 },
    h2: { color: '#8e24aa', fontWeight: 700 },
    h3: { color: '#8e24aa', fontWeight: 700 },
    body1: { color: '#333' },
    body2: { color: '#444' },
    button: { color: '#fff', fontWeight: 600 },
  },
});