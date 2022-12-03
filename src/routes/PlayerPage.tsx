import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stats, SeasonAverage, Player } from "../types";
import PlayerCard from "./PlayerCard";
import moment from 'moment';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from "@mui/x-data-grid";

function SeasonAverageStats(stats: SeasonAverage) {
  return <div>
    Stats for {stats.season}:
    <div>
      PPG: {stats.pts}
    </div>
    <div>
      APG: {stats.ast}
    </div>
    <div>
      REB: {stats.reb}
    </div>
    <div>
      STL: {stats.stl}
    </div>
    <div>
      BLK: {stats.blk}
    </div>
    <div>
      TO: {stats.turnover}
    </div>
    <div>
      FG%: {stats.fg_pct}%
    </div>
    <div>
      3PFG%: {stats.fg3_pct}%
    </div>
  </div>;
}

export default function PlayerPage() {
  let { playerId } = useParams();
  let startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  useEffect(() => {
    Promise.all([
      fetch(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}&start_date=${startDate}`).then(resp => resp.json()),
      fetch(`https://www.balldontlie.io/api/v1/players/${playerId}`).then(resp => resp.json()),
      fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerId}`).then(resp => resp.json()),
    ]).then(res => {
      setData(
        res[0].data.sort((stats1: Stats, stats2: Stats) =>
          moment(stats1.game.date).isAfter(
            moment(stats2.game.date)) ? -1 : 1)
      );
      setPlayer(res[1]);
      setSeasonAverage(res[2].data);
    })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);
  const [data, setData] = useState<Stats[]>([]);
  const [player, setPlayer] = useState<Player>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seasonAverage, setSeasonAverage] = useState<SeasonAverage[]>();

  const playerName = <div>{player?.first_name} {player?.last_name}</div>;
  const emptyStats = <div>No stats found for {playerName}</div>;
  const playerStats = (
    <></>);
  const currentSeasonAverages = seasonAverage?.length == 1 ? SeasonAverageStats(seasonAverage[0]) : <div>Player has not played this season</div>;

  const columns: GridColDef[] = [
    {
      field: 'date', headerName: 'Date', width: 130,
      valueGetter: (params: GridValueGetterParams) => moment(params.row.game.date).format('ddd MM/DD')
    },
    // { field: 'opponent', headerName: 'Opponent', width: 130 },
    // { field: 'result', headerName: 'Opponent', width: 130 },
    {
      field: 'min',
      headerName: 'MIN',
      width: 50,
    },
    {
      field: 'fg_pct',
      headerName: 'FG%',
      width: 70,
      valueGetter: (params: GridValueGetterParams) => Math.round(params.row.fg_pct * 1000) / 10,
    },
    {
      field: 'fg3_pct',
      headerName: '3P%',
      width: 70,
      valueGetter: (params: GridValueGetterParams) => Math.round(params.row.fg_pct * 1000) / 10,
    },
    {
      field: 'ft_pct',
      headerName: 'FT%',
      width: 70,
      valueGetter: (params: GridValueGetterParams) => Math.round(params.row.fg_pct * 1000) / 10,
    },
    {
      field: 'reb',
      headerName: 'REB',
      width: 40,
    },
    {
      field: 'ast',
      headerName: 'AST',
      width: 40,
    },
    {
      field: 'blk',
      headerName: 'BLK',
      width: 40,
    },
    {
      field: 'stl',
      headerName: 'STL',
      width: 40,
    },
    {
      field: 'pf',
      headerName: 'PF',
      width: 40,
    },
    {
      field: 'turnover',
      headerName: 'TO',
      width: 40,
    },
    {
      field: 'pts',
      headerName: 'PTS',
      width: 40,
    },
  ];

  return loading ? <>Loading</> : <div>
    <Box sx={{ flexGrow: 1 }} m="auto">
      {player && <PlayerCard player={player} />}
      <Grid>
        {currentSeasonAverages}
      </Grid>
      <div>
        Games from the last 30 days:
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={30}
            components={{ Toolbar: GridToolbar }}
          />
        </div>
      </div>
      <div>
        TODO: Past season stats
      </div>
    </Box>
  </div>;
}
