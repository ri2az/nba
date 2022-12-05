import { useCallback, useEffect, useState } from "react";
import * as d3 from "d3";
import { Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { NumberStats, Stats } from "../types";

type PlayerStatsChartProps = {
  stats: Stats[]
};

export default function PlayerStatsChart({ stats }: PlayerStatsChartProps) {
  const [statProperty, setStatProperty] = useState<NumberStats>('pts');

  const createGraph = useCallback((statProperty: NumberStats) => {
    console.log('stats', stats);
    let margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Append the graph, but remove the svg if it already exists
    d3.select('#graph-stats svg').remove();
    let svg = d3.select("#graph-stats").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis and Y axis
    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);
    x.domain(d3.extent(stats, d => new Date(d.game.date)) as [Date, Date]);
    y.domain([0, d3.max(stats, d => statProperty.includes("pct") ? 100 * (d[statProperty] as number) : d[statProperty] as number) as number]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom<Date>(x)
        .tickFormat(d3.timeFormat('%m/%e'))
      )
      .style("font-size", "18px");
    svg.append("g")
      .call(d3.axisLeft(y))
      .style("font-size", "18px");

    // Add the line data
    const strokeWidth = 1.5;
    svg.append('path')
      .data([stats])
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', strokeWidth)
      .attr('d', d3.line<any>()
        .x(d => x(new Date(d.game.date)))
        .y(d => statProperty.includes("pct") ? y(100 * d[statProperty]) : y(d[statProperty]))
      );
  }, [stats]);

  useEffect(() => {
    createGraph(statProperty);
  }, [createGraph, stats, statProperty]);

  const statOptions = {
    "ast": "AST",
    "pts": "PTS",
    "blk": "BLK",
    "reb": "REB",
    "fg3_pct": "3P%",
    "fg_pct": "FG%",
    "ft_pct": "FT%",
    "min": "MIN",
    "stl": "STL",
    "turnover": "TO"
  };

  console.log(Object.entries(statOptions))

  return (
    <Grid item xs={12}>
      <h2>Last few games stats chart</h2>
      <Select
        value={statProperty}
        onChange={(event: SelectChangeEvent) => setStatProperty(event.target.value as NumberStats)}
      >
        {Object.entries(statOptions).map(
          stat =>
            <MenuItem key={stat[0]} value={stat[0]}>{stat[1]}</MenuItem>
        )}
      </Select>
      <div id="graph-stats">
      </div>
    </Grid>
  );
}
