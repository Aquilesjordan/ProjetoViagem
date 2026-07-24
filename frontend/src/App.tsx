import { Container } from '@mui/material';
import AppRouter from './routes/AppRouter';
import { StatusSnackbar } from './components/ui/StatusSnackbar';

function App() {
  return (
    <Container maxWidth="xl" disableGutters>
      <AppRouter />
      <StatusSnackbar />
    </Container>
  );
}

export default App;
