import { useCallback, useEffect, useState } from "react";
import { Player, PlayerEndpoint } from "../types";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent, GetRowIdParams, GridReadyEvent, IServerSideGetRowsParams, PaginationChangedEvent, ValueGetterParams } from "ag-grid-community";
import 'ag-grid-enterprise';

const fetchPlayers = (
  page: number,
  pageSize: number,
  searchQuery: string,
  setError: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  params: IServerSideGetRowsParams,
) => {
  fetch(`https://www.balldontlie.io/api/v1/players?page=${page}&per_page=${pageSize}&search=${searchQuery}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `HTTP error: The status is ${response.status}`
        );
      }
      return response.json();
    })
    .then((data: PlayerEndpoint) => {
      params.success({
        rowData: data.data,
        rowCount: data.meta.total_count
      });
    })
    .catch(err => {
      setError(err);
      params.fail();
    })
    .finally(() => setLoading(false));
};
/**
 * We debounce this fetch so that search doesn't send a ton of requests to the
 * server.
 */
const fetchPlayersDebounced = AwesomeDebouncePromise(fetchPlayers, 300);

/**
 * Home page where we see all the players to choose from, and we can filter the
 * players with query specifiers.
 */
export default function Root() {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: 'first_name', headerName: 'First name' },
    { field: 'last_name', headerName: 'Last name' },
    {
      field: 'position',
      headerName: 'Position',
    },
    {
      field: 'height',
      headerName: 'Height',
      valueGetter: (params: ValueGetterParams) => params.data.height_feet * 12 + params.data.height_inches,
    },
    {
      field: 'team',
      headerName: 'Team',
      valueGetter: (params: ValueGetterParams) => params.data.team.name,
    }
  ]);

  const navigate = useNavigate();
  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event: CellClickedEvent) => {
    navigate(`/player/${event.data.id}`);
  }, [navigate]);


  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setServerSideDatasource({
      getRows: (params: IServerSideGetRowsParams) => {
        fetchPlayersDebounced(page + 1, pageSize, searchQuery, setError, setLoading, params);
      },
    });
  }, [page, pageSize, searchQuery, setError, setLoading]);

  return (<div>
    <Box sx={{ flexGrow: 1, width: '80vw', flexDirection: 'column' }} m="auto" display="flex" justifyContent="center">
      <Grid xs={12} height={'10vh'} justifyContent={'center'}>
        <h1>
          NBA STATS
        </h1>
      </Grid>
      <Grid xs={12} height={'10vh'}>
        <TextField
          label={"Search player by name"}
          value={searchQuery}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
          }}
          fullWidth={true}
        />
      </Grid>
      <Grid xs={12}>
        <div className="ag-theme-alpine-dark" style={{ height: '80vh' }}>
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={{ sortable: true, resizable: true }}
            animateRows={true}
            onCellClicked={cellClickedListener}
            loadingCellRenderer={loading}
            pagination={true}
            paginationPageSize={pageSize}
            cacheBlockSize={pageSize}
            onPaginationChanged={(event: PaginationChangedEvent) => setPage(event.api.paginationGetCurrentPage())}
            rowModelType='serverSide'
            getRowId={(params: GetRowIdParams<Player>) => String(params.data.id)}
            onGridReady={onGridReady}
          />
        </div>
      </Grid>
    </Box>
  </div>);
}
