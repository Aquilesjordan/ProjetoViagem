import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';

type HeaderProps = {
  onToggleSidebar: () => void;
};

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isFetching = useIsFetching();
  const open = Boolean(anchorEl);

  const userName = user?.name || 'Usuário';

  const userInitial = userName
    .trim()
    .charAt(0)
    .toUpperCase();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '68px !important',
          px: { xs: 1.5, md: 3 },
        }}
      >
        <IconButton
          edge="start"
          onClick={onToggleSidebar}
          sx={{
            display: { xs: 'flex', md: 'none' },
            mr: 1,
            color: 'text.primary',
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            sx={{
              letterSpacing: '-0.3px',
            }}
          >
            LogiTrack
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Controle de veículos, viagens e manutenções
          </Typography>
        </Box>

        {/* Usuário */}
        <Box>
          <IconButton
            onClick={handleMenuOpen}
            aria-label="Abrir menu do usuário"
            aria-controls={open ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              p: 0.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: 'primary.main',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              {userInitial}
            </Avatar>

            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                textAlign: 'left',
                ml: 1.2,
                mr: 0.5,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
                lineHeight={1.2}
              >
                {userName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Administrador
              </Typography>
            </Box>

            <KeyboardArrowDownRoundedIcon
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: 'text.secondary',
                fontSize: 20,
              }}
            />
          </IconButton>

          {/* Menu */}
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 1,
                  minWidth: 220,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                },
              },
            }}
          >
            {/* Informações do usuário */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="body2"
                fontWeight={700}
              >
                {userName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Conta administrativa
              </Typography>
            </Box>

            <Divider />

            <MenuItem
              disabled
              sx={{
                py: 1.2,
                gap: 1,
              }}
            >
              <ListItemIcon>
                <PersonRoundedIcon fontSize="small" />
              </ListItemIcon>

              <Typography variant="body2">
                Meu perfil
              </Typography>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.2,
                color: 'error.main',
                gap: 1,

                '&:hover': {
                  bgcolor: 'error.50',
                },
              }}
            >
              <ListItemIcon>
                <LogoutRoundedIcon
                  fontSize="small"
                  color="error"
                />
              </ListItemIcon>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                Sair
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {isFetching > 0 && (
        <LinearProgress
          sx={{
            height: 2,
          }}
        />
      )}
    </AppBar>
  );
}