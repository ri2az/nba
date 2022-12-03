import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stats, SeasonAverage, Player } from "../types";
import PlayerCard from "./PlayerCard";

function SeasonAverageStats(stats : SeasonAverage) {
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
  useEffect(() => {
    Promise.all([
      fetch(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}`).then(resp => resp.json()),
      fetch(`https://www.balldontlie.io/api/v1/players/${playerId}`).then(resp => resp.json()),
      fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerId}`).then(resp => resp.json()),
    ]).then(res => {
      setData(res[0].data);
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
  return loading ? <>Loading</> : <div>
    <Box sx={{ flexGrow: 1 }} m="auto">
      {player && <PlayerCard player={player}/>}
      <Grid>
        {currentSeasonAverages}
      </Grid>
      <div>
        TODO: Past few games
      </div>
      <div>
        TODO: Past season stats
      </div>
    </Box>
  </div>;
}
