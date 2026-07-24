import { Card, CardContent, Typography } from '@mui/material';

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );
}
