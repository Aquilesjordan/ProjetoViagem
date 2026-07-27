import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material';
import { AddRounded, CloseRounded, DirectionsCarFilledRounded } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchVeiculos, createVeiculo } from '../services/vehicleService';
import { Vehicle } from '../types/trip';
import { useNotification } from '../hooks/useNotification';
import { AppButton } from '../components/ui/AppButton';
import { FormTextField } from '../components/ui/FormTextField';

const columns: GridColDef<Vehicle>[] = [
  { field: 'placa', headerName: 'Placa', minWidth: 130, flex: 1 },
  { field: 'model', headerName: 'Modelo', minWidth: 220, flex: 1 },
  { field: 'tipo', headerName: 'Tipo', minWidth: 120, flex: 1 },
  {
    field: 'ano',
    headerName: 'Ano',
    minWidth: 100,
    flex: 1,
    valueGetter: (_value, row) => row.ano ?? '-',
  },
];

const vehicleTypes = ['LEVE', 'PESADO' ];

const vehicleSchema = z.object({
  placa: z
    .string()
    .min(7, 'Informe uma placa válida')
    .max(8, 'Informe uma placa válida'),
  model: z.string().min(2, 'Informe o modelo'),
  tipo: z.string().min(1, 'Selecione o tipo'),
  ano: z
    .string()
    .regex(/^\d{4}$/, 'Informe um ano válido')
    .refine((val) => Number(val) >= 1980 && Number(val) <= new Date().getFullYear() + 1, {
      message: 'Ano fora do intervalo esperado',
    }),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

function AddVehicleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const notification = useNotification();
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { placa: '', model: '', tipo: '', ano: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createVeiculo,
    onSuccess: () => {
      notification.showNotification('Veículo cadastrado com sucesso', 'success');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      reset();
      onClose();
    },
    onError: () => {
      notification.showNotification('Não foi possível cadastrar o veículo', 'error');
    },
  });

  const onSubmit = (formData: VehicleForm) => {
    mutate({ ...formData, ano: Number(formData.ano) });
  };

  const handleClose = () => {
    if (isPending) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'primary.50',
              color: 'primary.main',
            }}
          >
            <DirectionsCarFilledRounded fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              Novo veículo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preencha os dados para cadastrar
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={handleClose} disabled={isPending} size="small">
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <FormTextField<VehicleForm>
              name="placa"
              control={control}
              label="Placa"
              placeholder="ABC1D23"
              autoFocus
            />
            <FormTextField<VehicleForm> name="model" control={control} label="Modelo" placeholder="Ex: Mercedes-Benz O500" />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      label="Tipo"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    >
                      {vehicleTypes.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField<VehicleForm>
                  name="ano"
                  control={control}
                  label="Ano"
                  placeholder="2024"
                  inputMode="numeric"
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <AppButton variant="text" onClick={handleClose} disabled={isPending}>
            Cancelar
          </AppButton>
          <AppButton type="submit" loading={isPending}>
            Cadastrar veículo
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function VehiclesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVeiculos,
  });

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Veículos
          </Typography>
          <Typography color="text.secondary">Lista de veículos cadastrados.</Typography>
        </Box>
        <AppButton startIcon={<AddRounded />} onClick={() => setModalOpen(true)}>
          Novo veículo
        </AppButton>
      </Stack>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ height: 620, width: '100%' }}>
            <DataGrid
              rows={data ?? []}
              columns={columns}
              loading={isLoading}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              sx={{ border: 'none' }}
            />
          </Box>
          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              Não foi possível carregar os veículos.
            </Typography>
          )}
        </CardContent>
      </Card>

      <AddVehicleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}