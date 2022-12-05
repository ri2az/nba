import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stats, SeasonAverage, Player, Game, Team } from "../types";
import PlayerCard from "./PlayerCard";
import moment from 'moment';
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import PlayerStatsChart from "./PlayerStatsChart";

type TEAM_LOOKUP_TYPE = Record<number, Team>;

/**
 * When you click into a player, this is the page that shows the player's
 * stats, along with the past few games they've played.
 */
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
  }, [startDate, playerId]);
  const [data, setData] = useState<Stats[]>([]);
  const [teams, setTeams] = useState<TEAM_LOOKUP_TYPE>([]);
  const [player, setPlayer] = useState<Player>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [seasonAverage, setSeasonAverage] = useState<SeasonAverage[]>();

  const getResultText = (game: Game, playerTeamId: number) => {
    const homeTeam = game.home_team_id;
    const scoreHome = game.home_team_score;
    const scoreAway = game.visitor_team_score;

    const winResult = (playerTeamId === homeTeam) ? scoreHome > scoreAway : scoreAway > scoreHome;

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

  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate(`/`);
  };

  return loading ? <>Loading</> : <div>
    <Box sx={{ flexGrow: 1, width: '80vw' }} m="auto">
      <h4 id="go-back" onClick={handleHomeClick} style={{ cursor: 'pointer'}}>
        Go back to all players page
      </h4>
      {player && <PlayerCard player={player} stats={
        seasonAverage?.length === 1 ? seasonAverage[0] : null
      } />}
      <Grid item xs={12}>
        <h2>
          Games from the last 30 days
        </h2>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={25}
          />
        </div>
      </Grid>
      {data && <PlayerStatsChart stats={data}/>}
    </Box>
  </div>;
}
