import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';
import { Trip } from '../../types/trip';
import { formatDateTime, formatKilometers } from '../../utils/format';

type TripTableProps = {
  rows: Trip[];
  loading: boolean;
  rowCount: number;
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  onDelete: (row: Trip) => void;
};

const columnDefinitions: GridColDef<Trip>[] = [
  { field: 'veiculoModelo', headerName: 'Veículo', flex: 1, minWidth: 180 },
  { field: 'veiculoPlaca', headerName: 'Placa', flex: 1, minWidth: 120 },
  { field: 'origem', headerName: 'Origem', flex: 1, minWidth: 140 },
  { field: 'destino', headerName: 'Destino', flex: 1, minWidth: 140 },
  {
    field: 'dataSaida',
    headerName: 'Data de saída',
    flex: 1,
    minWidth: 170,
    valueGetter: (_value, row) => formatDateTime(row.dataSaida),
  },
  {
    field: 'dataChegada',
    headerName: 'Data de chegada',
    flex: 1,
    minWidth: 170,
    valueGetter: (_value, row) => (row.dataChegada ? formatDateTime(row.dataChegada) : '-'),
  },
  {
    field: 'kmPercorrida',
    headerName: 'KM percorrida',
    minWidth: 140,
    valueGetter: (_value, row) => formatKilometers(row.kmPercorrida),
  },
  {
    field: 'actions',
    headerName: 'Ações',
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    width: 140,
  },
];

export function TripTable({
  rows,
  loading,
  rowCount,
  page,
  pageSize,
  sortField,
  sortDirection,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onDelete,
}: TripTableProps) {
  const columns = columnDefinitions.map((column) =>
    column.field === 'actions'
      ? {
          ...column,
          renderCell: (params: GridRenderCellParams<Trip>) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton component={RouterLink} to={`/trips/${params.row.id}/edit`} size="small" color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(params.row)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ),
        }
      : column
  );

  const sortModel: GridSortModel = [{ field: sortField, sort: sortDirection }];

  return (
    <Box sx={{ height: 620, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationMode="server"
        sortingMode="server"
        paginationModel={{ page, pageSize }}
        pageSizeOptions={[5, 10, 20, 50]}
        onPaginationModelChange={(model) => {
          if (model.page !== page) {
            onPageChange(model.page);
          }
          if (model.pageSize !== pageSize) {
            onPageSizeChange(model.pageSize);
          }
        }}
        onSortModelChange={(newModel) => {
          if (newModel[0]?.field && newModel[0]?.sort) {
            onSortChange(newModel[0].field, newModel[0].sort);
          }
        }}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        sortModel={sortModel}
      />
    </Box>
  );
}
