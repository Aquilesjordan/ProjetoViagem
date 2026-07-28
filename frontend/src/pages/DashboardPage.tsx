import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Skeleton,
  Stack,
  Alert,
  AlertTitle,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  RouteRounded,
  LocalShippingRounded,
  TrendingUpRounded,
  RefreshRounded,
  BarChartRounded,
  DonutLargeRounded,
  DashboardRounded,
  PaymentsRounded,
  BuildRounded,
  CalendarMonthRounded,
  AccountBalanceWalletRounded,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useDashboard } from "../hooks/useDashboard";
import { StatCard } from "../components/ui/StatCard";
import { formatCurrency, formatDate } from "../utils/format";
import { ProximaManutencao } from "../types/dashboard";

const statIcons = [RouteRounded, LocalShippingRounded, TrendingUpRounded];

const statusConfig: Record<
  string,
  { label: string; color: "warning" | "info" | "success" }
> = {
  PENDENTE: { label: "Pendente", color: "warning" },
  EM_REALIZACAO: { label: "Em realização", color: "info" },
  CONCLUIDA: { label: "Concluída", color: "success" },
};

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
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "primary.50",
              color: "primary.main",
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

function CronogramaManutencao({
  rows,
}: {
  rows: ProximaManutencao[];
}) {
  return (
    <ChartCard title="Cronograma de Manutenção" icon={CalendarMonthRounded}>
      {rows.length === 0 ? (
        <Box
          sx={{
            py: 6,
            display: "grid",
            placeItems: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            Nenhuma manutenção agendada no momento.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Veículo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Placa</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Serviço</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Data início</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((m) => {
                const cfg = statusConfig[m.status] ?? {
                  label: m.status,
                  color: "info" as const,
                };
                return (
                  <TableRow key={m.id} hover>
                    <TableCell>{m.veiculoModelo}</TableCell>
                    <TableCell>{m.veiculoPlaca}</TableCell>
                    <TableCell>{m.tipoServico ?? "-"}</TableCell>
                    <TableCell>{formatDate(m.dataInicio)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={cfg.label}
                        color={cfg.color}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ChartCard>
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
      <Grid item xs={12}>
        <Skeleton variant="rounded" height={90} sx={{ borderRadius: 3 }} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
      </Grid>
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
      <Box sx={{ maxWidth: 480, mx: "auto", mt: 8 }}>
        <Alert
          severity="error"
          variant="outlined"
          action={
            typeof refetch === "function" ? (
              <Button
                color="error"
                size="small"
                startIcon={<RefreshRounded />}
                onClick={() => refetch()}
              >
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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: "primary.50",
            color: "primary.main",
          }}
        >
          <DashboardRounded />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Visão geral
          </Typography>
          <Typography color="text.secondary">
            Acompanhe os principais indicadores das suas viagens em tempo real.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* ── Indicadores ── */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total de quilômetros"
            value={`${data.totalQuilometros.toLocaleString("pt-BR")} km`}
            icon={RouteRounded}
          />
        </Grid>
        {[
          {
            label: "Total de viagens",
            value: data.totalViagens.toLocaleString("pt-BR"),
          },
          {
            label: "Total de veículos",
            value: data.totalVeiculos.toLocaleString("pt-BR"),
          },
          {
            label: "Manutenções pendentes",
            value: data.manutencoesPendentes.toLocaleString("pt-BR"),
          },
        ].map((indicator, index) => {
          const Icon = statIcons[index] ?? TrendingUpRounded;
          return (
            <Grid item xs={12} sm={6} md={3} key={indicator.label}>
              <StatCard
                label={indicator.label}
                value={indicator.value}
                icon={Icon}
              />
            </Grid>
          );
        })}

        {/* ── Gráficos ── */}
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Viagens por tipo de veículo"
            icon={BarChartRounded}
          >
            {data.viagensPorTipoVeiculo.length === 0 ? (
              <Box
                sx={{
                  height: 320,
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  Sem viagens registradas ainda.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={data.viagensPorTipoVeiculo}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(0,0,0,0.06)"
                    />
                    <XAxis
                      dataKey="tipo"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      width={40}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(63,81,181,0.06)" }}
                      contentStyle={{ borderRadius: 8, border: "1px solid #eee" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="quantidadeViagens"
                      name="Quantidade de viagens"
                      fill="#3f51b5"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Quilômetros por veículo" icon={DonutLargeRounded}>
            {data.quilometrosPorVeiculo.length === 0 ? (
              <Box
                sx={{
                  height: 320,
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  Sem dados suficientes para exibir o ranking.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={data.quilometrosPorVeiculo}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(0,0,0,0.06)"
                    />
                    <XAxis
                      dataKey="modelo"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      width={40}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        `${value.toLocaleString("pt-BR")} km`
                      }
                      contentStyle={{ borderRadius: 8, border: "1px solid #eee" }}
                    />
                    <Bar
                      dataKey="totalKm"
                      name="Quilômetros"
                      fill="#4caf50"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </ChartCard>
        </Grid>

        {/* ── Custo + status de manutenção ── */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "error.50",
                    color: "error.dark",
                    flexShrink: 0,
                  }}
                >
                  <PaymentsRounded fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Custo total de manutenção
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(data.custoTotalManutencao)}
                  </Typography>
                </Box>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 2 }}
              >
                <BuildRounded
                  fontSize="small"
                  sx={{ color: "text.secondary", mr: 0.5 }}
                />
                {data.manutencoesPorStatus.map((item) => {
                  const config = statusConfig[item.status] ?? {
                    label: item.status,
                    color: "info" as const,
                  };
                  return (
                    <Chip
                      key={item.status}
                      label={`${config.label}: ${item.quantidade}`}
                      color={config.color}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "warning.50",
                    color: "warning.dark",
                    flexShrink: 0,
                  }}
                >
                  <AccountBalanceWalletRounded fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Projeção financeira — mês atual
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(data.projecaoFinanceiraMesAtual)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Custo estimado de manutenções no mês corrente
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Cronograma de Manutenção ── */}
        <Grid item xs={12}>
          <CronogramaManutencao rows={data.proximasManutencoes ?? []} />
        </Grid>
      </Grid>
    </Box>
  );
}
