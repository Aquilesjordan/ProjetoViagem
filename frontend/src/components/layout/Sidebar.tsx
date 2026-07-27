import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const drawerWidth = 280;

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Veículos', to: '/veiculos', icon: <LocalShippingIcon /> },
  { label: 'Viagens', to: '/trips', icon: <DirectionsCarIcon /> },
  { label: 'Cadastro de Viagem', to: '/trips/new', icon: <AddBoxIcon /> },
  { label: 'Manutenções', to: '/manutencoes', icon: <BuildCircleIcon /> },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const location = useLocation();

  const drawerContent = (
    <>
      <Toolbar sx={{ justifyContent: 'center', px: 2 }}>
        <ListItemText primary="Menu" primaryTypographyProps={{ variant: 'h6', color: theme.palette.primary.main }} />
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={onClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
