import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTrip, fetchVehicles, createTrip, updateTrip } from '../services/tripService';
import { TripForm } from '../components/trips/TripForm';
import { toLocalDateTime } from '../utils/format';
import { useNotification } from '../hooks/useNotification';
import { TripPayload } from '../types/trip';

export default function TripFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notification = useNotification();

  const parsedTripId = id ? Number(id) : NaN;
  const tripId = Number.isNaN(parsedTripId) ? null : parsedTripId;
  const isEditMode = tripId !== null;

  const { data: trip, isLoading: loadingTrip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => fetchTrip(tripId as number),
    enabled: isEditMode,
  });

  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  const mutation = useMutation({
    mutationFn: (payload: { id?: number; values: TripPayload }) => {
      if (isEditMode && tripId) {
        return updateTrip(tripId, payload.values);
      }
      return createTrip(payload.values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      notification.showNotification('Viagem salva com sucesso', 'success');
      navigate('/trips');
    },
    onError: () => {
      notification.showNotification('Não foi possível salvar a viagem', 'error');
    },
  });

  const defaultValues = useMemo(() => {
    if (!trip) return undefined;
    return {
      veiculoId: trip.veiculoId,
      origem: trip.origem,
      destino: trip.destino,
      dataSaida: toLocalDateTime(trip.dataSaida),
      dataChegada: trip.dataChegada ? toLocalDateTime(trip.dataChegada) : '',
      kmPercorrida: trip.kmPercorrida,
    };
  }, [trip]);

  if (loadingTrip || loadingVehicles) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Editar viagem' : 'Cadastrar viagem'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TripForm
            defaultValues={defaultValues}
            vehicles={vehicles ?? []}
            isSubmitting={mutation.isPending}
            onSubmit={async (values) => {
              const payload: TripPayload = {
                ...values,
                dataChegada: values.dataChegada ? values.dataChegada : null,
              };

              await mutation.mutateAsync({ id: tripId ?? undefined, values: payload });
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
