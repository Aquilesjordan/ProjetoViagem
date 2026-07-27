import { Grid, Stack, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppButton } from '../ui/AppButton';
import { FormSelect } from '../ui/FormSelect';
import { FormTextField } from '../ui/FormTextField';
import type { Vehicle } from '../../types/trip';

const schema = z.object({
  veiculoId: z.coerce.number().min(1, 'Selecione um veículo'),
  origem: z.string().min(2, 'Informe a cidade de origem'),
  destino: z.string().min(2, 'Informe a cidade de destino'),
  dataSaida: z.string().min(1, 'Informe a data e hora de saída'),
  dataChegada: z.string().optional(),
  kmPercorrida: z.number().positive('Informe a quilometragem válida'),
}).superRefine((values, ctx) => {
  if (values.dataSaida && values.dataChegada && values.dataSaida >= values.dataChegada) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dataChegada'],
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
  const { handleSubmit, control } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      veiculoId: defaultValues?.veiculoId ?? 0,
      origem: defaultValues?.origem ?? '',
      destino: defaultValues?.destino ?? '',
      dataSaida: defaultValues?.dataSaida ?? '',
      dataChegada: defaultValues?.dataChegada ?? '',
      kmPercorrida: defaultValues?.kmPercorrida ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormSelect<FormValues>
            name="veiculoId"
            control={control}
            label="Veículo"
            options={vehicles.map((vehicle) => ({ label: `${vehicle.model} (${vehicle.placa})`, value: vehicle.id }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="kmPercorrida"
            control={control}
            defaultValue={defaultValues?.kmPercorrida ?? 0}
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
          <FormTextField<FormValues> name="origem" control={control} label="Cidade de origem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<FormValues> name="destino" control={control} label="Cidade de destino" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<FormValues> name="dataSaida" control={control} label="Data/Hora de saída" type="datetime-local" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField<FormValues> name="dataChegada" control={control} label="Data/Hora de chegada" type="datetime-local" InputLabelProps={{ shrink: true }} />
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
