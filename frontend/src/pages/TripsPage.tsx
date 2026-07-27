import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { deleteTrip, fetchVehicles } from '../services/tripService';
import { useTrips } from '../hooks/useTrips';
import { TripTable } from '../components/trips/TripTable';
import { Trip } from '../types/trip';
import { useNotification } from '../hooks/useNotification';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const defaultSize = 10;

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultSize);
  const [sortField, setSortField] = useState('dataSaida');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');
  const [tripToRemove, setTripToRemove] = useState<Trip | null>(null);
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

  const rows = data?.content ?? [];
  const total = data?.totalElements ?? 0;

  return (
    <Box>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5">Viagens</Typography>
          <Typography color="text.secondary">Gerencie as rotas, atualize ou exclua viagens com facilidade.</Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button component={RouterLink} to="/trips/new" variant="contained">
            Nova viagem
          </Button>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField label="Pesquisar" fullWidth value={search} onChange={handleSearch} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="vehicle-filter-label">Filtrar por veículo</InputLabel>
                <Select
                  labelId="vehicle-filter-label"
                  value={vehicleFilter}
                  label="Filtrar por veículo"
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
            onDelete={handleOpenDelete}
          />
          {isError && <Typography color="error">Não foi possível carregar as viagens.</Typography>}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={Boolean(tripToRemove)}
        title="Excluir viagem"
        description="Tem certeza de que deseja excluir esta viagem? Esta ação não pode ser desfeita."
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
