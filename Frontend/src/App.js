import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { TorrentProvider } from './contexts/TorrentContext';
import { SignalRProvider } from './contexts/SignalRContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import TorrentList from './pages/TorrentList';
import Sessions from './pages/Sessions';
import Settings from './pages/Settings';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SignalRProvider>
        <TorrentProvider>
          <Router>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Header />
              <Sidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  mt: 8, // Pour compenser la hauteur de l'header
                  ml: 25, // Pour compenser la largeur de la sidebar
                }}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/torrents" element={<TorrentList />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        </TorrentProvider>
      </SignalRProvider>
    </ThemeProvider>
  );
}

export default App;
