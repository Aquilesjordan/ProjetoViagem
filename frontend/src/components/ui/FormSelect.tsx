import { FormControl, InputLabel, MenuItem, Select, SelectProps, FormHelperText } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

type Props<T> = Omit<SelectProps, 'name' | 'value' | 'onChange'> & {
  name: keyof T & string;
  control: Control<T>;
  label: string;
  options: Option[];
  defaultValue?: string;
};

export function FormSelect<T>({ name, control, label, options, defaultValue = '', ...rest }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={Boolean(fieldState.error)}>
          <InputLabel>{label}</InputLabel>
          <Select label={label} {...field} {...rest}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
