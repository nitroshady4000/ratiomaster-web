import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Stop,
  Delete,
  Refresh,
  CloudUpload,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useDropzone } from 'react-dropzone';
import { useTorrents } from '../contexts/TorrentContext';
import { formatBytes, formatRatio, formatSpeed } from '../utils/formatters';

function TorrentList() {
  const {
    torrents,
    loading,
    error,
    addTorrent,
    startTorrent,
    stopTorrent,
    removeTorrent
  } = useTorrents();

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Colonnes de la DataGrid
  const columns = [
    {
      field: 'name',
      headerName: 'Nom',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Running' ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'totalSize',
      headerName: 'Taille',
      width: 120,
      renderCell: (params) => formatBytes(params.value || 0)
    },
    {
      field: 'uploaded',
      headerName: 'Uploadé',
      width: 120,
      renderCell: (params) => formatBytes(params.value || 0)
    },
    {
      field: 'downloaded',
      headerName: 'Téléchargé',
      width: 120,
      renderCell: (params) => formatBytes(params.value || 0)
    },
    {
      field: 'ratio',
      headerName: 'Ratio',
      width: 100,
      renderCell: (params) => (
        <span style={{ color: (params.value || 0) >= 1 ? '#4caf50' : '#ff9800' }}>
          {formatRatio(params.value || 0)}
        </span>
      )
    },
    {
      field: 'clientType',
      headerName: 'Client',
      width: 130
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {params.row.status === 'Running' ? (
            <IconButton
              size="small"
              onClick={() => stopTorrent(params.id)}
              color="error"
            >
              <Stop />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              onClick={() => startTorrent(params.id)}
              color="primary"
            >
              <PlayArrow />
            </IconButton>
          )}
          
          <IconButton
            size="small"
            onClick={() => removeTorrent(params.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Gestion des Torrents
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        >
          Ajouter un torrent
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={torrents}
              columns={columns}
              loading={loading}
              pageSize={25}
              rowsPerPageOptions={[25, 50, 100]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #333',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1e1e1e',
                  borderBottom: '2px solid #333',
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Dialog d'ajout de torrent */}
      <AddTorrentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={addTorrent}
      />

      {/* FAB pour actions rapides */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddDialogOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
}

// Composant pour ajouter un torrent
function AddTorrentDialog({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    clientType: 'uTorrent 3.5.5',
    uploadSpeed: 0,
    downloadSpeed: 0
  });
  const [torrentFile, setTorrentFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/x-bittorrent': ['.torrent']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setTorrentFile(file);
        if (!formData.name) {
          setFormData(prev => ({ ...prev, name: file.name.replace('.torrent', '') }));
        }
      }
    }
  });

  const handleSubmit = async () => {
    if (!torrentFile) {
      alert('Veuillez sélectionner un fichier torrent');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const torrentData = {
          name: formData.name,
          torrentData: Array.from(new Uint8Array(e.target.result)),
          clientType: formData.clientType,
          uploadSpeed: formData.uploadSpeed,
          downloadSpeed: formData.downloadSpeed
        };

        await onAdd(torrentData);
        onClose();
        resetForm();
      };
      reader.readAsArrayBuffer(torrentFile);
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      clientType: 'uTorrent 3.5.5',
      uploadSpeed: 0,
      downloadSpeed: 0
    });
    setTorrentFile(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ajouter un nouveau torrent</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Zone de drop pour le fichier torrent */}
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 3,
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            {torrentFile ? (
              <Typography variant="h6" color="primary">
                {torrentFile.name}
              </Typography>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez un fichier .torrent'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ou cliquez pour sélectionner
                </Typography>
              </Box>
            )}
          </Box>

          {/* Formulaire de configuration */}
          <TextField
            fullWidth
            label="Nom du torrent"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type de client</InputLabel>
            <Select
              value={formData.clientType}
              label="Type de client"
              onChange={(e) => setFormData(prev => ({ ...prev, clientType: e.target.value }))}
            >
              {clientTypes.map((client) => (
                <MenuItem key={client} value={client}>
                  {client}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              type="number"
              label="Vitesse upload (KB/s)"
              value={formData.uploadSpeed}
              onChange={(e) => setFormData(prev => ({ ...prev, uploadSpeed: parseInt(e.target.value) || 0 }))}
              fullWidth
            />
            <TextField
              type="number"
              label="Vitesse download (KB/s)"
              value={formData.downloadSpeed}
              onChange={(e) => setFormData(prev => ({ ...prev, downloadSpeed: parseInt(e.target.value) || 0 }))}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !torrentFile}
        >
          {loading ? 'Ajout...' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TorrentList;
