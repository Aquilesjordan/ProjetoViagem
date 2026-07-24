import Button, { ButtonProps } from '@mui/material/Button';

export function AppButton(props: ButtonProps) {
  return <Button variant="contained" fullWidth {...props} />;
}
