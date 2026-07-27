import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = Omit<TextFieldProps, 'name' | 'defaultValue'> & {
  name: Path<T>;
  control: Control<T>;
};

export function FormTextField<T extends FieldValues>({ name, control, ...rest }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField {...field} fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} {...rest} />
      )}
    />
  );
}
