import { Grid, Stack, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppButton } from '../ui/AppButton';
import { FormSelect } from '../ui/FormSelect';
import { FormTextField } from '../ui/FormTextField';
import type { Vehicle, TripPayload } from '../../types/trip';

const schema = z.object({
  vehicleId: z.string().min(1, 'Selecione um veículo'),
  origin: z.string().min(2, 'Informe a cidade de origem'),
  destination: z.string().min(2, 'Informe a cidade de destino'),
  departureDate: z.string().min(1, 'Informe a data e hora de saída'),
  arrivalDate: z.string().min(1, 'Informe a data e hora de chegada'),
  kilometers: z.number().positive('Informe a quilometragem válida'),
}).superRefine((values, ctx) => {
  if (values.departureDate && values.arrivalDate && values.departureDate >= values.arrivalDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['arrivalDate'],
      message: 'A data de chegada deve ser posterior à saída',
    });
  }
});

type FormValues = z.infer<typeof schema>;

type TripFormProps = {
  defaultValues?: Partial<FormValues>;
  vehicles: Vehicle[];
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function TripForm({ defaultValues, vehicles, onSubmit, isSubmitting }: TripFormProps) {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleId: defaultValues?.vehicleId ?? '',
      origin: defaultValues?.origin ?? '',
      destination: defaultValues?.destination ?? '',
      departureDate: defaultValues?.departureDate ?? '',
      arrivalDate: defaultValues?.arrivalDate ?? '',
      kilometers: defaultValues?.kilometers ?? 0,
    },
  });

  const watchDeparture = watch('departureDate');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormSelect<FormValues>
            name="vehicleId"
            control={control}
            label="Veículo"
            options={vehicles.map((vehicle) => ({ label: vehicle.name, value: vehicle.id }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="kilometers"
            control={control}
            defaultValue={defaultValues?.kilometers ?? 0}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Quilometragem"
                type="number"
                inputProps={{ min: 0 }}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<FormValues> name="origin" control={control} label="Cidade de origem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<FormValues> name="destination" control={control} label="Cidade de destino" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<FormValues> name="departureDate" control={control} label="Data/Hora de saída" type="datetime-local" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<FormValues> name="arrivalDate" control={control} label="Data/Hora de chegada" type="datetime-local" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <AppButton type="submit" disabled={isSubmitting}>
              Salvar
            </AppButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
