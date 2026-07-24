import { Backdrop, CircularProgress } from '@mui/material';

export function LoadingOverlay({ open }: { open: boolean }) {
  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
