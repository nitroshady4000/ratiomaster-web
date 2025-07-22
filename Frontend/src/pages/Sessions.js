import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Chip
} from '@mui/material';
import {
  Save,
  FolderOpen,
  Delete,
  PlayArrow,
  GetApp
} from '@mui/icons-material';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [stopTorrents, setStopTorrents] = useState(true);
  const [error, setError] = useState(null);

  const handleSaveSession = async () => {
    if (!sessionName.trim()) {
      setError('Veuillez entrer un nom de session');
      return;
    }

    try {
      // TODO: Implémenter la sauvegarde via l'API
      console.log('Sauvegarde de la session:', { sessionName, stopTorrents });
      setSaveDialogOpen(false);
      setSessionName('');
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleLoadSession = async (sessionPath, autoStart = false) => {
    try {
      // TODO: Implémenter le chargement via l'API
      console.log('Chargement de la session:', { sessionPath, autoStart });
      alert('Session chargée avec succès');
    } catch (err) {
      setError('Erreur lors du chargement de la session');
    }
  };

  const handleDeleteSession = async (sessionName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la session "${sessionName}" ?`)) {
      try {
        // TODO: Implémenter la suppression via l'API
        console.log('Suppression de la session:', sessionName);
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Sessions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => setSaveDialogOpen(true)}
        >
          Sauvegarder la session actuelle
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<GetApp />}
        >
          Actualiser
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sessions sauvegardées
          </Typography>
          
          {sessions.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
              Aucune session sauvegardée
            </Typography>
          ) : (
            <List>
              {sessions.map((session) => (
                <ListItem key={session.name} divider>
                  <ListItemText
                    primary={session.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Créé le: {new Date(session.createdAt).toLocaleString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={`${session.torrentCount} torrents`}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={session.totalSize}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleLoadSession(session.path, false)}
                      title="Charger la session"
                    >
                      <FolderOpen />
                    </IconButton>
                    <IconButton
                      onClick={() => handleLoadSession(session.path, true)}
                      title="Charger et démarrer"
                      color="primary"
                    >
                      <PlayArrow />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSession(session.name)}
                      title="Supprimer"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Dialog de sauvegarde */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Sauvegarder la session actuelle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la session"
            fullWidth
            variant="outlined"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={stopTorrents}
                onChange={(e) => setStopTorrents(e.target.checked)}
              />
            }
            label="Arrêter tous les torrents avant de sauvegarder"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveSession} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sessions;
