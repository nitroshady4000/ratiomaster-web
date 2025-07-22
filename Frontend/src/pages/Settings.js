import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Alert
} from '@mui/material';

function Settings() {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    minimizeToTray: true,
    showTrayBalloon: false,
    enable24hFormat: false,
    
    // Paramètres par défaut pour nouveaux torrents
    defaultClient: 'uTorrent 3.5.5',
    defaultUploadSpeed: 0,
    defaultDownloadSpeed: 0,
    defaultUpdateInterval: 1800,
    
    // Paramètres d'interface
    theme: 'dark',
    autoRefresh: true,
    refreshInterval: 30
  });

  const [saved, setSaved] = useState(false);

  const clientTypes = [
    'uTorrent 3.5.5',
    'uTorrent 2.2.1',
    'BitTorrent 7.10.5',
    'Azureus 5.7.6.0',
    'BitComet 1.70',
    'Transmission 3.00',
    'Deluge 2.0.3',
    'qBittorrent 4.4.0'
  ];

  const handleSave = () => {
    // TODO: Sauvegarder les paramètres via l'API
    localStorage.setItem('ratiomaster-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      localStorage.removeItem('ratiomaster-settings');
      window.location.reload();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Paramètres sauvegardés avec succès
        </Alert>
      )}

      {/* Paramètres généraux */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Paramètres généraux
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.minimizeToTray}
                  onChange={(e) => setSettings(prev => ({ ...prev, minimizeToTray: e.target.checked }))}
                />
              }
              label="Réduire dans la barre système"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.showTrayBalloon}
                  onChange={(e) => setSettings(prev => ({ ...prev, showTrayBalloon: e.target.checked }))}
                />
              }
              label="Afficher les notifications"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.enable24hFormat}
                  onChange={(e) => setSettings(prev => ({ ...prev, enable24hFormat: e.target.checked }))}
                />
              }
              label="Format 24h pour l'heure"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.autoRefresh}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))}
                />
              }
              label="Actualisation automatique"
            />
            
            {settings.autoRefresh && (
              <TextField
                type="number"
                label="Intervalle d'actualisation (secondes)"
                value={settings.refreshInterval}
                onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) || 30 }))}
                sx={{ maxWidth: 300 }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Paramètres par défaut des torrents */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Paramètres par défaut des nouveaux torrents
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Client par défaut</InputLabel>
              <Select
                value={settings.defaultClient}
                label="Client par défaut"
                onChange={(e) => setSettings(prev => ({ ...prev, defaultClient: e.target.value }))}
              >
                {clientTypes.map((client) => (
                  <MenuItem key={client} value={client}>
                    {client}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                label="Vitesse upload par défaut (KB/s)"
                value={settings.defaultUploadSpeed}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultUploadSpeed: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
              <TextField
                type="number"
                label="Vitesse download par défaut (KB/s)"
                value={settings.defaultDownloadSpeed}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultDownloadSpeed: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
            </Box>
            
            <TextField
              type="number"
              label="Intervalle de mise à jour par défaut (secondes)"
              value={settings.defaultUpdateInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultUpdateInterval: parseInt(e.target.value) || 1800 }))}
              sx={{ maxWidth: 400 }}
              helperText="Temps entre les annonces au tracker"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Sauvegarder les paramètres
        </Button>
        <Button variant="outlined" color="error" onClick={handleReset}>
          Réinitialiser
        </Button>
      </Box>
    </Box>
  );
}

export default Settings;
