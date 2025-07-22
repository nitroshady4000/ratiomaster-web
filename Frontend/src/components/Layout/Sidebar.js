import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Divider,
  Box
} from '@mui/material';
import {
  Dashboard,
  List as ListIcon,
  FolderOpen,
  Settings,
  Info
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Tableau de bord', icon: <Dashboard />, path: '/' },
  { text: 'Torrents', icon: <ListIcon />, path: '/torrents' },
  { text: 'Sessions', icon: <FolderOpen />, path: '/sessions' },
  { text: 'Paramètres', icon: <Settings />, path: '/settings' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText 
                primary="À propos" 
                secondary="Version 2.0.0"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
