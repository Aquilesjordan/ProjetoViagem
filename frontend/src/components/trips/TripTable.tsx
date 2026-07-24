import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
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

const columnDefinitions: GridColDef[] = [
  { field: 'vehicle', headerName: 'Veículo', flex: 1, minWidth: 150 },
  { field: 'origin', headerName: 'Origem', flex: 1, minWidth: 120 },
  { field: 'destination', headerName: 'Destino', flex: 1, minWidth: 120 },
  {
    field: 'departureDate',
    headerName: 'Saída',
    flex: 1,
    minWidth: 170,
    valueGetter: (params: GridValueGetterParams) => formatDateTime(params.value as string),
  },
  {
    field: 'arrivalDate',
    headerName: 'Chegada',
    flex: 1,
    minWidth: 170,
    valueGetter: (params: GridValueGetterParams) => formatDateTime(params.value as string),
  },
  {
    field: 'kilometers',
    headerName: 'KM',
    type: 'number',
    minWidth: 100,
    valueGetter: (params: GridValueGetterParams) => formatKilometers(Number(params.value)),
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
  const columns = columnDefinitions.map((column) => {
    if (column.field === 'actions') {
      return {
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
      };
    }
    return column;
  });

  const sortModel: GridSortModel = [{ field: sortField, sort: sortDirection }];

  return (
    <Box sx={{ height: 620, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        pagination
        paginationMode="server"
        sortingMode="server"
        page={page}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20, 50]}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortModelChange={(newModel) => {
          if (newModel[0]?.field && newModel[0]?.sort) {
            onSortChange(newModel[0].field, newModel[0].sort);
          }
        }}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        sortModel={sortModel}
      />
    </Box>
  );
}
