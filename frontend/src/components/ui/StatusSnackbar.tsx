import { Alert, Snackbar } from '@mui/material';
import { useNotification } from '../../hooks/useNotification';

export function StatusSnackbar() {
  const { open, message, severity, closeNotification } = useNotification();

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={closeNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={closeNotification} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
