import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

type Props<T> = Omit<TextFieldProps, 'name' | 'defaultValue'> & {
  name: keyof T & string;
  control: Control<T>;
  defaultValue?: string;
};

export function FormTextField<T>({ name, control, defaultValue = '', ...rest }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <TextField {...field} fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} {...rest} />
      )}
    />
  );
}
