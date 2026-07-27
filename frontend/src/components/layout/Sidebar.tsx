import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const drawerWidth = 250;

const navItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <DashboardRoundedIcon />,
  },
  {
    label: 'Veículos',
    to: '/veiculos',
    icon: <DirectionsCarRoundedIcon />,
  },
  {
    label: 'Viagens',
    to: '/trips',
    icon: <RouteRoundedIcon />,
  },
  {
    label: 'Manutenções',
    to: '/manutencoes',
    icon: <BuildRoundedIcon />,
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const location = useLocation();

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo / título */}
      <Toolbar
        sx={{
          minHeight: '72px !important',
          px: 2.5,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={800}
            color="primary.main"
            sx={{
              letterSpacing: '-0.5px',
            }}
          >
            LogiTrack
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: -0.3,
            }}
          >
            Gestão de frota
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* Navegação */}
      <Box sx={{ px: 1.5, py: 2 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{
            px: 1.5,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          Menu principal
        </Typography>

        <List sx={{ mt: 1, p: 0 }}>
          {navItems.map((item) => {
            const isSelected =
              location.pathname === item.to ||
              (item.to === '/trips' &&
                location.pathname.startsWith('/trips/'));

            return (
              <ListItemButton
                key={item.to}
                component={Link}
                to={item.to}
                selected={isSelected}
                onClick={onClose}
                sx={{
                  minHeight: 46,
                  mb: 0.5,
                  px: 1.5,
                  borderRadius: 2,

                  color: 'text.secondary',

                  '& .MuiListItemIcon-root': {
                    minWidth: 40,
                    color: 'text.secondary',
                    transition: 'color 0.2s ease',
                  },

                  '& .MuiListItemText-primary': {
                    fontSize: '0.92rem',
                    fontWeight: 500,
                  },

                  '&:hover': {
                    bgcolor: 'action.hover',

                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },

                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main + '12',
                    color: 'primary.main',

                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },

                    '& .MuiListItemText-primary': {
                      fontWeight: 700,
                    },

                    '&:hover': {
                      bgcolor: theme.palette.primary.main + '18',
                    },

                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 3,
                      borderRadius: '0 4px 4px 0',
                      bgcolor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Espaço inferior */}
      <Box sx={{ flex: 1 }} />

      <Divider />

      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Sistema de Gestão de Frota
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}