import { Box, Typography } from '@mui/material';

export function EmptyState({ message }: { message: string }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
    </Box>
  );
}
