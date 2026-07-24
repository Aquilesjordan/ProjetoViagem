import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', px: 2, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" gutterBottom>
        Página não encontrada.
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained">
        Voltar ao dashboard
      </Button>
    </Box>
  );
}
