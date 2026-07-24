import { Card, CardContent, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/ui/StatCard';

const chartColors = ['#3f51b5', '#ff9800', '#4caf50', '#f44336'];

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return <Typography>Falha ao carregar os dados do dashboard.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StatCard label="Total de quilômetros" value={`${data.totalKilometers.toLocaleString('pt-BR')} km`} />
      </Grid>
      {data.indicators.slice(0, 3).map((indicator) => (
        <Grid item xs={12} md={4} key={indicator.label}>
          <StatCard label={indicator.label} value={indicator.value} />
        </Grid>
      ))}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Volume por categoria
            </Typography>
            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={data.categoryVolumes} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ranking de veículos
            </Typography>
            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.vehicleRanking} dataKey="kilometers" nameKey="vehicle" cx="50%" cy="50%" outerRadius={100} label>
                    {data.vehicleRanking.map((entry, index) => (
                      <Cell key={entry.vehicle} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString('pt-BR')} km`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
