import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { torrentService } from '../services/torrentService';
import { useSignalR } from './SignalRContext';

const TorrentContext = createContext();

const initialState = {
  torrents: [],
  selectedTorrent: null,
  loading: false,
  error: null,
  globalStats: {
    totalTorrents: 0,
    activeTorrents: 0,
    totalUploaded: 0,
    totalDownloaded: 0,
    totalRatio: 0
  }
};

function torrentReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_TORRENTS':
      return { ...state, torrents: action.payload, loading: false };
    
    case 'ADD_TORRENT':
      return { 
        ...state, 
        torrents: [...state.torrents, action.payload],
        loading: false 
      };
    
    case 'UPDATE_TORRENT':
      return {
        ...state,
        torrents: state.torrents.map(t => 
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        )
      };
    
    case 'REMOVE_TORRENT':
      return {
        ...state,
        torrents: state.torrents.filter(t => t.id !== action.payload)
      };
    
    case 'SELECT_TORRENT':
      return { ...state, selectedTorrent: action.payload };
    
    case 'UPDATE_GLOBAL_STATS':
      return { ...state, globalStats: action.payload };
    
    default:
      return state;
  }
}

export function TorrentProvider({ children }) {
  const [state, dispatch] = useReducer(torrentReducer, initialState);
  const { connection } = useSignalR();

  // Charger les torrents au démarrage
  useEffect(() => {
    loadTorrents();
  }, []);

  // Écouter les événements SignalR
  useEffect(() => {
    if (connection) {
      connection.on('TorrentAdded', (torrent) => {
        dispatch({ type: 'ADD_TORRENT', payload: torrent });
      });

      connection.on('TorrentStatusChanged', ({ id, status }) => {
        dispatch({ type: 'UPDATE_TORRENT', payload: { id, status } });
      });

      connection.on('TorrentRemoved', (id) => {
        dispatch({ type: 'REMOVE_TORRENT', payload: id });
      });

      return () => {
        connection.off('TorrentAdded');
        connection.off('TorrentStatusChanged');
        connection.off('TorrentRemoved');
      };
    }
  }, [connection]);

  // Mettre à jour les statistiques globales
  useEffect(() => {
    const stats = calculateGlobalStats(state.torrents);
    dispatch({ type: 'UPDATE_GLOBAL_STATS', payload: stats });
  }, [state.torrents]);

  const loadTorrents = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const torrents = await torrentService.getAllTorrents();
      dispatch({ type: 'SET_TORRENTS', payload: torrents });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addTorrent = async (torrentData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newTorrent = await torrentService.addTorrent(torrentData);
      dispatch({ type: 'ADD_TORRENT', payload: newTorrent });
      return newTorrent;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const startTorrent = async (id) => {
    try {
      await torrentService.startTorrent(id);
      dispatch({ type: 'UPDATE_TORRENT', payload: { id, status: 'Running' } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const stopTorrent = async (id) => {
    try {
      await torrentService.stopTorrent(id);
      dispatch({ type: 'UPDATE_TORRENT', payload: { id, status: 'Stopped' } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const removeTorrent = async (id) => {
    try {
      await torrentService.removeTorrent(id);
      dispatch({ type: 'REMOVE_TORRENT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const startAllTorrents = async () => {
    try {
      await torrentService.startAllTorrents();
      await loadTorrents();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const stopAllTorrents = async () => {
    try {
      await torrentService.stopAllTorrents();
      await loadTorrents();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const calculateGlobalStats = (torrents) => {
    return {
      totalTorrents: torrents.length,
      activeTorrents: torrents.filter(t => t.status === 'Running').length,
      totalUploaded: torrents.reduce((sum, t) => sum + (t.uploaded || 0), 0),
      totalDownloaded: torrents.reduce((sum, t) => sum + (t.downloaded || 0), 0),
      totalRatio: torrents.length > 0 
        ? torrents.reduce((sum, t) => sum + (t.ratio || 0), 0) / torrents.length 
        : 0
    };
  };

  const value = {
    ...state,
    addTorrent,
    startTorrent,
    stopTorrent,
    removeTorrent,
    startAllTorrents,
    stopAllTorrents,
    loadTorrents,
    selectTorrent: (torrent) => dispatch({ type: 'SELECT_TORRENT', payload: torrent })
  };

  return (
    <TorrentContext.Provider value={value}>
      {children}
    </TorrentContext.Provider>
  );
}

export const useTorrents = () => {
  const context = useContext(TorrentContext);
  if (!context) {
    throw new Error('useTorrents must be used within a TorrentProvider');
  }
  return context;
};
