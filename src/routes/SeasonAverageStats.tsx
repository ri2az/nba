import { Card, Grid, Typography } from "@mui/material";
import { SeasonAverage } from "../types";

type SeasonAverageStatsProps = {
  stats: SeasonAverage | null
};

function statBox(title: string, value: number | string) {
  return <Grid item xs={3}>
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} variant="outlined">
      <Typography color="text.primary" component={'span'} gutterBottom>
        <h3>
          {title}
        </h3>
      </Typography>
      <Typography sx={{ fontSize: 20 }} color="text.primary" component={'span'}>
        <h4>
          {value}
        </h4>
      </Typography>
    </Card>
  </Grid>;
}

export default function SeasonAverageStats({ stats }: SeasonAverageStatsProps) {
  if (stats) {
    return <Grid container spacing={2}>
        <Grid item xs={12}>
          <h3>
            Stats for {stats.season}-{stats.season + 1} Season
          </h3>
        </Grid>
        {statBox('PPG', stats.pts)}
        {statBox('AGP', stats.ast)}
        {statBox('REB', stats.reb)}
        {statBox('STL', stats.stl)}
        {statBox('BLK', stats.blk)}
        {statBox('TO', stats.turnover)}
        {statBox('FG%',
          Math.round(stats.fg_pct * 1000) / 10)}
        {statBox('3P%',
          Math.round(stats.fg3_pct * 1000) / 10)}
      </Grid>;
  } else {
    return <div>Player has not played this season</div>
  };
}
