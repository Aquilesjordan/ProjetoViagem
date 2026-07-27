import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  InputAdornment,
  Fade,
} from '@mui/material';
import {
  PersonOutlineRounded,
  WorkOutlineRounded,
  DirectionsBusFilledRounded,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { AppButton } from '../components/ui/AppButton';
import { FormTextField } from '../components/ui/FormTextField';

const loginSchema = z.object({
  emailOrCpf: z.string().min(3, 'Informe e-mail ou CPF'),
  password: z.string().min(6, 'Informe sua senha'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const notification = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, control } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginForm) => {
    setIsSubmitting(true);
    try {
      await login(formData);
      notification.showNotification('Login realizado com sucesso', 'success');
    } catch (error) {
      notification.showNotification('Usuário ou senha inválidos', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '45%',
          p: 6,
          background: 'linear-gradient(160deg, #0B3D91 0%, #1E5FCC 55%, #4C8DFF 100%)',
          color: 'common.white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            top: -120,
            right: -100,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            bottom: -80,
            left: -60,
          }}
        />

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ zIndex: 1 }}>
          <DirectionsBusFilledRounded sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight={700}>
            LogiTrack
          </Typography>
        </Stack>

        <Box sx={{ zIndex: 1 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2, lineHeight: 1.25 }}>
            Gerencie suas viagens com simplicidade
          </Typography>
          <Typography sx={{ opacity: 0.85, maxWidth: 380 }}>
            Acompanhe rotas, motoristas e reservas em um painel único, pensado para o seu dia a dia.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ opacity: 0.6, zIndex: 1 }}>
          © {new Date().getFullYear()} LogiTrack. Todos os direitos reservados.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          bgcolor: 'background.default',
        }}
      >
        <Fade in timeout={400}>
          <Card
            elevation={0}
            sx={{
              maxWidth: 400,
              width: '100%',
              p: { xs: 3, sm: 4 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'primary.main' }}
              >
                <DirectionsBusFilledRounded />
                <Typography variant="subtitle1" fontWeight={700}>
                  LogiTrack
                </Typography>
              </Stack>

              <Box>
                <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
                  Bem-vindo de volta
                </Typography>
                <Typography color="text.secondary">
                  Entre com suas credenciais para acessar o painel administrativo.
                </Typography>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2.5}>
                  <FormTextField<LoginForm>
                    name="emailOrCpf"
                    control={control}
                    label="E-mail ou CPF"
                    autoFocus
                    autoComplete="username"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineRounded fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormTextField<LoginForm>
                    name="password"
                    control={control}
                    label="Senha"
                    type="password"
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkOutlineRounded fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                 

                  <AppButton type="submit" loading={isSubmitting} fullWidth size="large">
                    Entrar
                  </AppButton>
                </Stack>
              </form>


             
            </Stack>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
}