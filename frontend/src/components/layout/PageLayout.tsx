import { Box, Toolbar, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const drawerWidth = 280;

const breadcrumbsMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/trips': 'Viagens',
  '/trips/new': 'Cadastro de Viagem',
};

export default function PageLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const breadcrumbLabel = useMemo(() => {
    return breadcrumbsMap[location.pathname] || 'Viagens';
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box sx={{ flexGrow: 1, ml: { md: `${drawerWidth}px` } }}>
        <Header onToggleSidebar={() => setSidebarOpen((state) => !state)} />
        <Toolbar />
        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <MuiLink component={RouterLink} underline="hover" color="inherit" to="/dashboard">
              Home
            </MuiLink>
            <Typography color="text.primary">{breadcrumbLabel}</Typography>
          </Breadcrumbs>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
