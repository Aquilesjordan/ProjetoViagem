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

  const isEditMode = Boolean(id);

  const { data: trip, isLoading: loadingTrip } = useQuery(['trip', id], () => fetchTrip(id as string), {
    enabled: isEditMode,
  });

  const { data: vehicles, isLoading: loadingVehicles } = useQuery(['vehicles'], fetchVehicles);

  const mutation = useMutation({
    mutationFn: (payload: { id?: string; values: TripPayload }) => {
      if (isEditMode && id) {
        return updateTrip(id, payload.values);
      }
      return createTrip(payload.values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trips']);
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
      vehicleId: trip.vehicleId,
      origin: trip.origin,
      destination: trip.destination,
      departureDate: toLocalDateTime(trip.departureDate),
      arrivalDate: toLocalDateTime(trip.arrivalDate),
      kilometers: trip.kilometers,
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
            isSubmitting={mutation.isLoading}
            onSubmit={async (values) => {
              const payload: TripPayload = {
                ...values,
                departureDate: values.departureDate,
                arrivalDate: values.arrivalDate,
              };

              await mutation.mutateAsync({ id, values: payload });
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
