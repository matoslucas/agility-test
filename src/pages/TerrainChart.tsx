import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchPlanetsTerrain } from "../services/swapi";
import PageContainer from "../layout/PageContainer";

interface TerrainCount {
  [key: string]: number;
}

const TerrainChart: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [terrainCounts, setTerrainCounts] = useState<TerrainCount>({});

  useEffect(() => {
    fetchPlanetsTerrain().then((data) => {
      console.log("data", data);
      const counts = data.reduce<TerrainCount>((acc, planet) => {
        planet.terrain.forEach((t) => {
          acc[t] = (acc[t] || 0) + 1;
        });
        return acc;
      }, {});
      setTerrainCounts(counts);
    });
  }, []);

  useEffect(() => {
    if (Object.keys(terrainCounts).length > 0) {
      drawChart(terrainCounts);
    }
  }, [terrainCounts]);

  const drawChart = (data: TerrainCount) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 1200 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;

    const svgElement = d3.select(ref.current).select("svg");
    if (!svgElement.empty()) {
      svgElement.remove();
    }

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(data)) || 0])
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(Object.keys(data))
      .padding(0.1);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("myRect")
      .data(Object.entries(data))
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d[0])!)
      .attr("width", (d) => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");
  };

  return (
    <PageContainer>
      <div ref={ref} />
    </PageContainer>
  );
};

export default TerrainChart;
