import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stats, SeasonAverage, Player, Game, Team } from "../types";
import PlayerCard from "./PlayerCard";
import moment from 'moment';
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { green, red } from '@mui/material/colors';

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
      FG%: {Math.round(stats.fg_pct * 1000) / 10}%
    </div>
    <div>
      3P%: {Math.round(stats.fg3_pct * 1000) / 10}%
    </div>
  </div>;
}

type TEAM_LOOKUP_TYPE = Record<number, Team>;

export default function PlayerPage() {
  let { playerId } = useParams();
  let startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const statDateComparator =
    (stats1: Stats, stats2: Stats) =>
      moment(stats1.game.date).isAfter(
        moment(stats2.game.date)) ? -1 : 1;
  const dateComparator = (date1: string, date2: string) =>
    moment(date1).isAfter(
      moment(date2)) ? -1 : 1;
  useEffect(() => {
    Promise.all([
      fetch(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}&start_date=${startDate}`).then(resp => resp.json()),
      fetch(`https://www.balldontlie.io/api/v1/players/${playerId}`).then(resp => resp.json()),
      fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerId}`).then(resp => resp.json()),
      fetch('https://www.balldontlie.io/api/v1/teams').then(resp => resp.json())
    ]).then(res => {
      setData(
        res[0].data.sort(statDateComparator));
      setPlayer(res[1]);
      setSeasonAverage(res[2].data);

      let teamObject: TEAM_LOOKUP_TYPE = {};
      for (let i = 0; i < res[3].data.length; i++) {
        teamObject[res[3].data[i].id] = res[3].data[i];
      }
      setTeams(teamObject);
    })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);
  const [data, setData] = useState<Stats[]>([]);
  const [teams, setTeams] = useState<TEAM_LOOKUP_TYPE>([]);
  const [player, setPlayer] = useState<Player>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seasonAverage, setSeasonAverage] = useState<SeasonAverage[]>();

  const playerName = <div>{player?.first_name} {player?.last_name}</div>;
  const emptyStats = <div>No stats found for {playerName}</div>;
  const playerStats = (
    <></>);
  const currentSeasonAverages = seasonAverage?.length == 1 ? SeasonAverageStats(seasonAverage[0]) : <div>Player has not played this season</div>;

  const getResultText = (game: Game, playerTeamId: number) => {
    const homeTeam = game.home_team_id;
    const scoreHome = game.home_team_score;
    const scoreAway = game.visitor_team_score;

    const winResult = (playerTeamId === homeTeam) ? scoreHome > scoreAway : scoreAway < scoreHome;

    return `${winResult ? 'W' : 'L'} ${scoreHome}-${scoreAway}`;
  }

  const getOpponentText = (game: Game, playerTeamId: number) => {
    const homeTeam = game.home_team_id;

    return (playerTeamId === homeTeam) ? teams[game.visitor_team_id].name : teams[game.home_team_id].name;
  }

  const columns: GridColDef[] = [
    {
      field: 'date', headerName: 'Date', width: 130,
      valueGetter: (params: GridValueGetterParams) => moment(params.row.game.date).format('ddd MM/DD'),
      sortComparator: dateComparator
    },
    {
      field: 'result', headerName: 'Result', width: 130,
      valueGetter: (params: GridValueGetterParams) => getResultText(params.row.game, params.row.team.id),
    },
    {
      field: 'opponent', headerName: 'Opponent', width: 130,
      valueGetter: (params: GridValueGetterParams) => getOpponentText(params.row.game, params.row.team.id),
    },
    {
      field: 'min',
      headerName: 'MIN',
      width: 70,
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
            pageSize={25}
          />
        </div>
      </div>
      <div>
        TODO: Past season stats
      </div>
    </Box>
  </div>;
}
