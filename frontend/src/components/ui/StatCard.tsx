import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  label: string;
  value: string;
  icon?: SvgIconComponent;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {Icon && (
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'primary.50',
                color: 'primary.main',
                flexShrink: 0,
              }}
            >
              <Icon />
            </Box>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}