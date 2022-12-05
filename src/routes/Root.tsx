import { useEffect, useState } from "react";
import { PlayerEndpoint } from "../types";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { DataGrid, GridCallbackDetails, GridColDef, GridRowParams, GridToolbar, GridValueGetterParams, MuiEvent } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const fetchPlayers = (
  page: number,
  pageSize: number,
  searchQuery: string,
  setData: React.Dispatch<React.SetStateAction<PlayerEndpoint | undefined>>,
  setError: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
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
    .then(data => {
      setData(data);
    })
    .catch(err => setError(err))
    .finally(() => setLoading(false));
};
const fetchPlayersDebounced = AwesomeDebouncePromise(fetchPlayers, 300);
/**
 * Home page where we see all the players to choose from, and we can filter the
 * players with query specifiers.
 */
export default function Root() {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [data, setData] = useState<PlayerEndpoint>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchPlayersDebounced(page + 1, pageSize, searchQuery, setData, setError, setLoading);
  }, [page, pageSize, searchQuery, fetchPlayersDebounced]);

  const [rowCountState, setRowCountState] = useState(
    data?.meta.total_count || 0,
  );

  const columns: GridColDef[] = [
    { field: 'first_name', headerName: 'First name', width: 200 },
    { field: 'last_name', headerName: 'Last name', width: 200 },
    {
      field: 'position',
      headerName: 'Position',
      width: 130,
    },
    {
      field: 'height',
      headerName: 'Height',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => params.row.height_feet * 12 + params.row.height_inches,
    },
    {
      field: 'team',
      headerName: 'Team',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => params.row.team.name,
    }
  ];

  const navigate = useNavigate();
  const handleRowClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
    navigate(`/player/${params.row.id}`);
  };
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.meta.total_count !== undefined
        ? data?.meta.total_count
        : prevRowCountState,
    );
  }, [data?.meta.total_count, setRowCountState]);

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
        <div style={{ height: '80vh' }}>
          <DataGrid
            rows={data?.data || []}
            rowCount={rowCountState}
            columns={columns}
            pageSize={pageSize}
            paginationMode="server"
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            onRowClick={handleRowClick}
            components={{ Toolbar: GridToolbar }}
            loading={loading}
          />
        </div>
      </Grid>
    </Box>
  </div>);
}
