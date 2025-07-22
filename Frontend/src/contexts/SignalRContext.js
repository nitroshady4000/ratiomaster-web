import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();

export function SignalRProvider({ children }) {
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('/hub/torrents')
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log('SignalR connecté');
        setConnected(true);
      })
      .catch(err => {
        console.error('Erreur SignalR:', err);
        setConnected(false);
      });

    newConnection.onreconnected(() => {
      console.log('SignalR reconnecté');
      setConnected(true);
    });

    newConnection.onclose(() => {
      console.log('SignalR déconnecté');
      setConnected(false);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const value = {
    connection,
    connected
  };

  return (
    <SignalRContext.Provider value={value}>
      {children}
    </SignalRContext.Provider>
  );
}

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};
