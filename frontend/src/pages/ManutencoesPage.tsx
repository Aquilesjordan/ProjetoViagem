import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { fetchManutencoes } from '../services/manutencaoService';
import { Manutencao } from '../types/manutencao';
import { formatCurrency, formatDate } from '../utils/format';

const columns: GridColDef<Manutencao>[] = [
  { field: 'veiculoModelo', headerName: 'Veículo', minWidth: 220, flex: 1 },
  { field: 'veiculoPlaca', headerName: 'Placa', minWidth: 130, flex: 1 },
  { field: 'tipoServico', headerName: 'Tipo de serviço', minWidth: 180, flex: 1 },
  {
    field: 'dataInicio',
    headerName: 'Data de início',
    minWidth: 130,
    flex: 1,
    valueGetter: (params) => formatDate(params.row.dataInicio),
  },
  {
    field: 'dataFinalizacao',
    headerName: 'Data de finalização',
    minWidth: 150,
    flex: 1,
    valueGetter: (params) => formatDate(params.row.dataFinalizacao),
  },
  {
    field: 'custoEstimado',
    headerName: 'Custo',
    minWidth: 120,
    flex: 1,
    valueGetter: (params) => formatCurrency(params.row.custoEstimado ?? 0),
  },
  { field: 'status', headerName: 'Status', minWidth: 150, flex: 1 },
];

export default function ManutencoesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['manutencoes'],
    queryFn: fetchManutencoes,
  });

  return (
    <Box>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h5">Manutenções</Typography>
          <Typography color="text.secondary">Acompanhamento de manutenção por veículo.</Typography>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Box sx={{ height: 620, width: '100%' }}>
            <DataGrid
              rows={data ?? []}
              columns={columns}
              loading={isLoading}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
            />
          </Box>
          {isError && <Typography color="error">Não foi possível carregar as manutenções.</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
}
