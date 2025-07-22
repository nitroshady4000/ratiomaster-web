import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Chip
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
  Settings,
  CloudDownload,
  CloudUpload
} from '@mui/icons-material';
import { useTorrents } from '../../contexts/TorrentContext';
import { useSignalR } from '../../contexts/SignalRContext';
import { formatBytes } from '../../utils/formatters';

function Header() {
  const { 
    globalStats, 
    startAllTorrents, 
    stopAllTorrents, 
    loadTorrents 
  } = useTorrents();
  const { connected } = useSignalR();

  return (
    <AppBar 
      position="fixed" 
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          RatioMaster.NET Web
          <Chip
            label={connected ? 'Connecté' : 'Déconnecté'}
            color={connected ? 'success' : 'error'}
            size="small"
            sx={{ ml: 2 }}
          />
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Statistiques globales */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload fontSize="small" />
            <Typography variant="body2">
              {formatBytes(globalStats.totalUploaded)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudDownload fontSize="small" />
            <Typography variant="body2">
              {formatBytes(globalStats.totalDownloaded)}
            </Typography>
          </Box>

          <Badge badgeContent={globalStats.activeTorrents} color="primary">
            <Typography variant="body2">
              {globalStats.totalTorrents} torrents
            </Typography>
          </Badge>

          {/* Actions globales */}
          <IconButton
            color="inherit"
            onClick={startAllTorrents}
            title="Démarrer tous les torrents"
          >
            <PlayArrow />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={stopAllTorrents}
            title="Arrêter tous les torrents"
          >
            <Stop />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={loadTorrents}
            title="Actualiser"
          >
            <Refresh />
          </IconButton>

          <IconButton color="inherit" title="Paramètres">
            <Settings />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
