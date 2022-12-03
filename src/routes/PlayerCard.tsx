import { Grid } from "@mui/material";
import { Player, SeasonAverage } from "../types";
import SeasonAverageStats from "./SeasonAverageStats";

type PlayerCardProps = {
  player: Player,
  stats: SeasonAverage | null
};

/**
 * A player component that displays some basic info about the player
 *
 * @param player Player data
 */
export default function PlayerCard({ player, stats }: PlayerCardProps) {
  return <Grid container xs={12}>
    <Grid item xs={12}>
      <h1>
        {player.first_name} {player.last_name}
      </h1>
    </Grid>
    <Grid item xs={4}>
      <h3>
        Info
      </h3>
      <div>
        Team: {player.team.full_name}
      </div>
      <div>
        Height: {player.height_feet}' {player.height_inches}"
      </div>
      <div>
        Weight: {player.weight_pounds} lbs
      </div>
    </Grid>
    <SeasonAverageStats stats={stats}/>
  </Grid>;
}
