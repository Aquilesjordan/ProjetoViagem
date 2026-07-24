import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { AppButton } from '../components/ui/AppButton';
import { FormTextField } from '../components/ui/FormTextField';

const loginSchema = z.object({
  emailOrCpf: z.string().min(3, 'Informe e-mail ou CPF'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const notification = useNotification();
  const { handleSubmit, control } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginForm) => {
    try {
      await login(formData);
      notification.showNotification('Login realizado com sucesso', 'success');
    } catch (error) {
      notification.showNotification('Usuário ou senha inválidos', 'error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" component="h1" gutterBottom>
                Entrar no sistema
              </Typography>
              <Typography color="text.secondary">Acesse seu painel administrativo e gerencie as viagens.</Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <FormTextField<LoginForm> name="emailOrCpf" control={control} label="E-mail ou CPF" />
                <FormTextField<LoginForm> name="password" control={control} label="Senha" type="password" />
                <AppButton type="submit">Entrar</AppButton>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
