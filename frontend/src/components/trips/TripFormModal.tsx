import { Dialog, DialogTitle, DialogContent, IconButton, Box, Stack, Typography } from '@mui/material';
import { CloseRounded, RouteRounded } from '@mui/icons-material';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTrip, fetchVehicles, createTrip, updateTrip } from '../../services/tripService';
import { TripForm } from './TripForm';
import { toLocalDateTime } from '../../utils/format';
import { useNotification } from '../../hooks/useNotification';
import { TripPayload } from '../../types/trip';

interface TripFormModalProps {
  open: boolean;
  tripId: number | null;
  onClose: () => void;
}

export function TripFormModal({ open, tripId, onClose }: TripFormModalProps) {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const isEditMode = tripId !== null;

  const { data: trip, isLoading: loadingTrip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => fetchTrip(tripId as number),
    enabled: isEditMode && open,
  });

  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    enabled: open,
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
      onClose();
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

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const isLoadingData = (isEditMode && loadingTrip) || loadingVehicles;

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
            <RouteRounded fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {isEditMode ? 'Editar viagem' : 'Nova viagem'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditMode ? 'Atualize os dados da viagem' : 'Preencha os dados para cadastrar'}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={handleClose} disabled={mutation.isPending} size="small">
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoadingData ? (
          <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 300 }}>
            <Typography color="text.secondary">Carregando...</Typography>
          </Box>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
}