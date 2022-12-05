import { useEffect } from "react";
import * as d3 from "d3";
import { Grid } from "@mui/material";
import { Stats } from "../types";

type PlayerStatsChartProps = {
  stats: Stats[]
};

export default function PlayerStatsChart({ stats }: PlayerStatsChartProps) {
  const createGraph = () => {
    console.log('stats', stats);
    let margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    // append the graph, but remove the svg if it already exists
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
    y.domain([0, d3.max(stats, d => d.pts) as number]);
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
    svg.append('path')
      .data([stats])
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line<any>()
        .x(d => x(new Date(d.game.date)))
        .y(d => y(d.pts))
      );
  }
  useEffect(() => {
    createGraph();
  }, [createGraph, stats]);
  return (
    <Grid item xs={12}>
      <h2>Last few games stats chart</h2>
      <div id="graph-stats">
      </div>
    </Grid>
  );
}
