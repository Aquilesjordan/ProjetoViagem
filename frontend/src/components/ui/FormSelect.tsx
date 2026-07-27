import { FormControl, InputLabel, MenuItem, Select, SelectProps, FormHelperText } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

type Props<T extends FieldValues> = Omit<SelectProps, 'name' | 'value' | 'onChange'> & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
};

export function FormSelect<T extends FieldValues>({ name, control, label, options, ...rest }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
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
