import { useEffect, useState } from "react";
import { Player, PlayerEndpoint } from "../types";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { DataGrid, GridCallbackDetails, GridColDef, GridRowParams, GridToolbar, GridValueGetterParams, MuiEvent } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";

/**
 * Home page where we see all the players to choose from, and we can filter the
 * players with query specifiers.
 */
export default function Root() {
  const fetchPlayers = (page: number, pageSize: number) => {
    fetch(`https://www.balldontlie.io/api/v1/players?page=${page}&per_page=${pageSize}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setData(data);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [data, setData] = useState<PlayerEndpoint>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => fetchPlayers(page+1, pageSize), [page, pageSize]);

  const [rowCountState, setRowCountState] = useState(
    data?.meta.total_count || 0,
  );

  const columns: GridColDef[] = [
    { field: 'first_name', headerName: 'First name', width: 130 },
    { field: 'last_name', headerName: 'Last name', width: 130 },
    {
      field: 'position',
      headerName: 'Position',
      width: 90,
    },
    {
      field: 'height',
      headerName: 'Height',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => params.row.height_feet * 12 + params.row.height_inches,
    },
    {
      field: 'team',
      headerName: 'Team',
      width: 90,
      valueGetter: (params: GridValueGetterParams) => params.row.team.name,
    }
  ];

  // TODO: have row click go into player page
  const navigate = useNavigate();
  const handleRowClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
    console.log(params.row.first_name, 'clicked');
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
    <Box sx={{ flexGrow: 1 }} m="auto">
      <Grid xs={12}>
        NBA STATS
      </Grid>
      <Grid xs={12}>
        <div>Need to do pagination search</div>
        <div style={{ height: 800, width: '100%' }}>
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
