import { useEffect, useState } from 'react';
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
  Chip,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  AddRounded,
  CloseRounded,
  DirectionsCarFilledRounded,
  BadgeOutlined,
  LocalShippingRounded,
  CalendarTodayOutlined,
  CategoryOutlined,
  EditRounded,
  DeleteRounded,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchVeiculos, createVeiculo, updateVeiculo, deleteVeiculo } from '../services/vehicleService';
import { Vehicle } from '../types/trip';
import { useNotification } from '../hooks/useNotification';
import { AppButton } from '../components/ui/AppButton';
import { FormTextField } from '../components/ui/FormTextField';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const vehicleTypes = ['LEVE', 'PESADO'] as const;

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

function TipoChip({ tipo }: { tipo: string }) {
  const isPesado = tipo === 'PESADO';
  return (
    <Chip
      size="small"
      icon={<LocalShippingRounded sx={{ fontSize: 16 }} />}
      label={isPesado ? 'Pesado' : 'Leve'}
      sx={{
        bgcolor: isPesado ? 'warning.50' : 'success.50',
        color: isPesado ? 'warning.dark' : 'success.dark',
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: isPesado ? 'warning.dark' : 'success.dark',
        },
      }}
    />
  );
}

function buildColumns(
  onEdit: (vehicle: Vehicle) => void,
  onDelete: (vehicle: Vehicle) => void
): GridColDef<Vehicle>[] {
  return [
    { field: 'placa', headerName: 'Placa', minWidth: 130, flex: 1 },
    { field: 'model', headerName: 'Modelo', minWidth: 220, flex: 1 },
    {
      field: 'tipo',
      headerName: 'Tipo',
      minWidth: 140,
      flex: 1,
      renderCell: (params) => <TipoChip tipo={params.value as string} />,
    },
    {
      field: 'ano',
      headerName: 'Ano',
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.ano ?? '-',
    },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      width: 130,
      renderCell: (params: GridRenderCellParams<Vehicle>) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" color="primary" onClick={() => onEdit(params.row)}>
            <EditRounded fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete(params.row)}>
            <DeleteRounded fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];
}

function VehicleFormModal({
  open,
  onClose,
  editingVehicle,
}: {
  open: boolean;
  onClose: () => void;
  editingVehicle: Vehicle | null;
}) {
  const notification = useNotification();
  const queryClient = useQueryClient();
  const isEditing = Boolean(editingVehicle);

  const { handleSubmit, control, reset } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { placa: '', model: '', tipo: '', ano: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { placa: string; model: string; tipo: string; ano: number }) =>
      isEditing && editingVehicle
        ? updateVeiculo({ id: editingVehicle.id, ...payload })
        : createVeiculo(payload),
    onSuccess: () => {
      notification.showNotification(
        isEditing ? 'Veículo atualizado com sucesso' : 'Veículo cadastrado com sucesso',
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      reset();
      onClose();
    },
    onError: () => {
      notification.showNotification(
        isEditing ? 'Não foi possível atualizar o veículo' : 'Não foi possível cadastrar o veículo',
        'error'
      );
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

  const heading = isEditing ? 'Editar veículo' : 'Novo veículo';
  const subtitle = isEditing ? 'Atualize os dados do veículo' : 'Preencha os dados para cadastrar';

  useEffect(() => {
    if (editingVehicle && open) {
      reset({
        placa: editingVehicle.placa,
        model: editingVehicle.model,
        tipo: editingVehicle.tipo,
        ano: String(editingVehicle.ano ?? ''),
      });
      return;
    }

    if (open) {
      reset({ placa: '', model: '', tipo: '', ano: '' });
    }
  }, [editingVehicle, open, reset]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'primary.50',
              color: 'primary.main',
            }}
          >
            <DirectionsCarFilledRounded fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {heading}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlined fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormTextField<VehicleForm>
              name="model"
              control={control}
              label="Modelo"
              placeholder="Ex: Mercedes-Benz O500"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCarFilledRounded fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryOutlined fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      {vehicleTypes.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo === 'PESADO' ? 'Pesado' : 'Leve'}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayOutlined fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <AppButton variant="text" onClick={handleClose} disabled={isPending}>
            Cancelar
          </AppButton>
          <AppButton type="submit" disabled={isPending}>
            {isPending ? (isEditing ? 'Salvando...' : 'Cadastrando...') : isEditing ? 'Salvar alterações' : 'Cadastrar veículo'}
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Box
      sx={{
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        color: 'text.secondary',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'action.hover',
        }}
      >
        <DirectionsCarFilledRounded sx={{ fontSize: 28 }} />
      </Box>
      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
        Nenhum veículo cadastrado
      </Typography>
      <Typography variant="body2" sx={{ maxWidth: 320, textAlign: 'center' }}>
        Cadastre o primeiro veículo da frota para começar a acompanhar viagens e manutenções.
      </Typography>
      <AppButton startIcon={<AddRounded />} onClick={onAdd} sx={{ mt: 1, }}>
        Novo veículo
      </AppButton>
    </Box>
  );
}

export default function VehiclesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleToRemove, setVehicleToRemove] = useState<Vehicle | null>(null);
  const queryClient = useQueryClient();
  const notification = useNotification();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVeiculos,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVeiculo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      notification.showNotification('Veículo removido com sucesso', 'success');
    },
    onError: () => {
      notification.showNotification('Não foi possível excluir o veículo', 'error');
    },
  });

  const vehicles = data ?? [];
  const columns = buildColumns(
    (vehicle) => {
      setEditingVehicle(vehicle);
      setModalOpen(true);
    },
    (vehicle) => setVehicleToRemove(vehicle)
  );

  const handleOpenCreate = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setModalOpen(false);
    setEditingVehicle(null);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'primary.50',
              color: 'primary.main',
            }}
          >
            <DirectionsCarFilledRounded />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" fontWeight={700}>
                Veículos
              </Typography>
              {!isLoading && !isError && (
                <Chip
                  size="small"
                  label={`${vehicles.length} ${vehicles.length === 1 ? 'veículo' : 'veículos'}`}
                  sx={{ bgcolor: 'action.hover', fontWeight: 600 }}
                />
              )}
            </Stack>
            <Typography color="text.secondary">Lista de veículos cadastrados.</Typography>
          </Box>
        </Stack>
      <AppButton
        startIcon={<AddRounded />}
        onClick={handleOpenCreate}
        sx={{
          width: 'auto !important',
          minWidth: 'auto !important',
          maxWidth: 'fit-content',
          flex: '0 0 auto',
          px: 2,
          py: 1,
          fontSize: '0.875rem',
        }}
      >
        Novo veículo
      </AppButton>
      </Stack>

      {isError ? (
        <Alert severity="error" variant="outlined">
          Não foi possível carregar os veículos. Tente novamente em instantes.
        </Alert>
      ) : (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Box sx={{ height: 620, width: '100%' }}>
              {!isLoading && vehicles.length === 0 ? (
                <EmptyState onAdd={() => setModalOpen(true)} />
              ) : (
                <DataGrid
                  rows={vehicles}
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
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                      bgcolor: 'action.hover',
                      borderRadius: 2,
                    },
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' },
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      <VehicleFormModal open={modalOpen} onClose={handleCloseFormModal} editingVehicle={editingVehicle} />

      <ConfirmDialog
        open={Boolean(vehicleToRemove)}
        title="Excluir este veículo?"
        description={
          vehicleToRemove
            ? `Você está prestes a excluir o veículo ${vehicleToRemove.model} (${vehicleToRemove.placa}). Essa ação é permanente e não poderá ser desfeita.`
            : 'Essa ação é permanente e não poderá ser desfeita.'
        }
        onClose={() => setVehicleToRemove(null)}
        onConfirm={() => {
          if (!vehicleToRemove) return;
          deleteMutation.mutate(vehicleToRemove.id);
          setVehicleToRemove(null);
        }}
      />
    </Box>
  );
}