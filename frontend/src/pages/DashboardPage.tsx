import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Skeleton,
  Stack,
  Chip,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import {
  RouteRounded,
  LocalShippingRounded,
  TrendingUpRounded,
  RefreshRounded,
  BarChartRounded,
  DonutLargeRounded,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/ui/StatCard';
import { formatCurrency } from '../utils/format';

const statIcons = [RouteRounded, LocalShippingRounded, TrendingUpRounded];

function ChartCard({
  title,
  icon: Icon,
  children,
}: {
  title: string; 
  icon: React.ElementType;
  children: React.ReactNode;
}) {
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
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'primary.50',
              color: 'primary.main',
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
      {Array.from({ length: 2 }).map((_, i) => (
        <Grid item xs={12} md={6} key={i}>
          <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
    </Grid>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={260} height={44} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={340} sx={{ mb: 3 }} />
        <DashboardSkeleton />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8 }}>
        <Alert
          severity="error"
          variant="outlined"
          action={
            typeof refetch === 'function' ? (
              <Button color="error" size="small" startIcon={<RefreshRounded />} onClick={() => refetch()}>
                Tentar novamente
              </Button>
            ) : undefined
          }
        >
          <AlertTitle>Não foi possível carregar o dashboard</AlertTitle>
          Verifique sua conexão ou tente novamente em instantes.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Visão geral
        </Typography>
        <Typography color="text.secondary">
          Acompanhe os principais indicadores das suas viagens em tempo real.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total de quilômetros"
            value={`${data.totalQuilometros.toLocaleString('pt-BR')} km`}
            icon={RouteRounded}
          />
        </Grid>
        {[
          { label: 'Total de viagens', value: data.totalViagens.toLocaleString('pt-BR') },
          { label: 'Total de veículos', value: data.totalVeiculos.toLocaleString('pt-BR') },
          { label: 'Manutenções pendentes', value: data.manutencoesPendentes.toLocaleString('pt-BR') },
        ].map((indicator, index) => {
          const Icon = statIcons[index] ?? TrendingUpRounded;
          return (
            <Grid item xs={12} sm={6} md={3} key={indicator.label}>
              <StatCard label={indicator.label} value={indicator.value} icon={Icon} />
            </Grid>
          );
        })}

        <Grid item xs={12} md={6}>
          <ChartCard title="Viagens por tipo de veículo" icon={BarChartRounded}>
            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={data.viagensPorTipoVeiculo} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="tipo" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <Tooltip
                    cursor={{ fill: 'rgba(63,81,181,0.06)' }}
                    contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                  />
                  <Legend />
                  <Bar dataKey="quantidadeViagens" fill="#3f51b5" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Quilômetros por veículo" icon={DonutLargeRounded}>
            {data.quilometrosPorVeiculo.length === 0 ? (
              <Box
                sx={{
                  height: 320,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body2">Sem dados suficientes para exibir o ranking.</Typography>
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={data.quilometrosPorVeiculo}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="modelo" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                    <Tooltip
                      formatter={(value: number) => `${value.toLocaleString('pt-BR')} km`}
                      contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                    />
                    <Bar dataKey="totalKm" fill="#4caf50" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </ChartCard>
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary">
            Custo total de manutenção: <strong>{formatCurrency(data.custoTotalManutencao)}</strong>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}