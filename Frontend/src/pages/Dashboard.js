import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  PlayCircle,
  PauseCircle,
  Download,
  Upload
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTorrents } from '../contexts/TorrentContext';
import { formatBytes, formatRatio } from '../utils/formatters';

function Dashboard() {
  const { torrents, globalStats } = useTorrents();

  // Données pour les graphiques
  const statusData = [
    { name: 'Actifs', value: globalStats.activeTorrents, color: '#4caf50' },
    { name: 'Arrêtés', value: globalStats.totalTorrents - globalStats.activeTorrents, color: '#f44336' }
  ];

  const recentActivity = torrents
    .filter(t => t.lastUpdate)
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
    .slice(0, 10)
    .map((t, index) => ({
      name: t.name.substring(0, 20),
      ratio: t.ratio || 0,
      time: index
    }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Torrents
                  </Typography>
                  <Typography variant="h4">
                    {globalStats.totalTorrents}
                  </Typography>
                </Box>
                <PlayCircle sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Torrents Actifs
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {globalStats.activeTorrents}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Uploadé
                  </Typography>
                  <Typography variant="h5">
                    {formatBytes(globalStats.totalUploaded)}
                  </Typography>
                </Box>
                <Upload sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Ratio Moyen
                  </Typography>
                  <Typography variant="h5" color={globalStats.totalRatio >= 1 ? 'success.main' : 'warning.main'}>
                    {formatRatio(globalStats.totalRatio)}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: globalStats.totalRatio >= 1 ? 'success.main' : 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste des torrents récents */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Torrents récents
            </Typography>
            {torrents.slice(0, 5).map((torrent) => (
              <Box key={torrent.id} sx={{ mb: 2, p: 2, border: '1px solid #333', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" noWrap>
                    {torrent.name}
                  </Typography>
                  <Chip
                    label={torrent.status}
                    color={torrent.status === 'Running' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    ↑ {formatBytes(torrent.uploaded || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ↓ {formatBytes(torrent.downloaded || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ratio: {formatRatio(torrent.ratio || 0)}
                  </Typography>
                </Box>
                
                {torrent.status === 'Running' && (
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((torrent.uploaded / torrent.totalSize) * 100, 100)} 
                    sx={{ height: 4 }}
                  />
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}

export default Dashboard;
