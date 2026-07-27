import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AddRounded,
  RouteRounded,
  SearchRounded,
  DirectionsCarFilledRounded,
} from '@mui/icons-material';
import { deleteTrip, fetchVehicles } from '../services/tripService';
import { useTrips } from '../hooks/useTrips';
import { TripTable } from '../components/trips/TripTable';
import { TripFormModal } from '../components/trips/TripFormModal';
import { Trip } from '../types/trip';
import { useNotification } from '../hooks/useNotification';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AppButton } from '../components/ui/AppButton';

const defaultSize = 10;

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultSize);
  const [sortField, setSortField] = useState('dataSaida');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');
  const [tripToRemove, setTripToRemove] = useState<Trip | null>(null);

  // Controle do modal de criação/edição
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const notification = useNotification();

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  const queryParams = useMemo(
    () => ({
      page,
      size: pageSize,
      originCity: search || undefined,
      vehicleId: vehicleFilter ? Number(vehicleFilter) : undefined,
      sort: `${sortField},${sortDirection}`,
    }),
    [page, pageSize, search, sortField, sortDirection, vehicleFilter]
  );

  const { data, isLoading, isError } = useTrips(queryParams);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      notification.showNotification('Viagem removida com sucesso', 'success');
    },
    onError: () => {
      notification.showNotification('Falha ao excluir a viagem', 'error');
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleOpenDelete = (trip: Trip) => {
    setTripToRemove(trip);
  };

  const handleCloseDelete = () => {
    setTripToRemove(null);
  };

  const handleOpenCreate = () => {
    setEditingTripId(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setEditingTripId(trip.id);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setEditingTripId(null);
  };

  const rows = data?.content ?? [];
  const total = data?.totalElements ?? 0;

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
            <RouteRounded />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" fontWeight={700}>
                Viagens
              </Typography>
              {!isLoading && !isError && (
                <Chip
                  size="small"
                  label={`${total} ${total === 1 ? 'viagem' : 'viagens'}`}
                  sx={{ bgcolor: 'action.hover', fontWeight: 600 }}
                />
              )}
            </Stack>
            <Typography color="text.secondary">
              Gerencie as rotas, atualize ou exclua viagens com facilidade.
            </Typography>
          </Box>
        </Stack>
        <AppButton startIcon={<AddRounded />} onClick={handleOpenCreate} 
         sx={{
          width: 'auto !important',
          minWidth: 'auto !important',
          maxWidth: 'fit-content',
          flex: '0 0 auto',
          px: 2,
          py: 1,
          fontSize: '0.875rem',
        }}>
          Nova viagem
        </AppButton>
      </Stack>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} md={5}>
              <TextField
                label="Pesquisar por origem"
                placeholder="Ex: São Paulo"
                fullWidth
                value={search}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel id="vehicle-filter-label">Filtrar por veículo</InputLabel>
                <Select
                  labelId="vehicle-filter-label"
                  value={vehicleFilter}
                  label="Filtrar por veículo"
                  startAdornment={
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <DirectionsCarFilledRounded fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  onChange={(event) => {
                    setVehicleFilter(event.target.value as string);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {(vehicles ?? []).map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} ({vehicle.placa})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {isError ? (
            <Alert severity="error" variant="outlined">
              Não foi possível carregar as viagens. Tente novamente em instantes.
            </Alert>
          ) : (
            <TripTable
  rows={rows}
  loading={isLoading}
  rowCount={total}
  page={page}
  pageSize={pageSize}
  sortField={sortField}
  sortDirection={sortDirection}
  onPageChange={(newPage) => setPage(newPage)}
  onPageSizeChange={(newSize) => {
    setPageSize(newSize);
    setPage(0);
  }}
  onSortChange={(field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  }}
  onEdit={handleOpenEdit}
  onDelete={handleOpenDelete}
/>
          )}
        </CardContent>
      </Card>

      <TripFormModal open={formModalOpen} tripId={editingTripId} onClose={handleCloseFormModal} />

      <ConfirmDialog
        open={Boolean(tripToRemove)}
        
        title="Excluir esta viagem?"
        description={
          tripToRemove
            ? `Você está prestes a excluir a viagem de ${tripToRemove.origem} para ${tripToRemove.destino}. Essa ação é permanente e não poderá ser desfeita.`
            : 'Essa ação é permanente e não poderá ser desfeita.'
        }
        onClose={handleCloseDelete}
        onConfirm={() => {
          if (tripToRemove) {
            deleteMutation.mutate(tripToRemove.id);
            handleCloseDelete();
          }
        }}
      />
    </Box>
  );
}