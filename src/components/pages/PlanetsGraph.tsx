import { Planet } from "../../types";
import React, { useEffect, useRef, useState } from "react";
import { fetchPlanets } from "../../services/swapi";
import * as d3 from "d3";
import PageContainer from "../layout/PageContainer";

const terrainColors: { [key: string]: string } = {
  desert: "#EDC9AF",
  grasslands: "#7CFC00",
  mountains: "#A9A9A9",
  jungle: "#228B22",
  forest: "#006400",
  ocean: "#1E90FF",
  swamp: "#556B2F",
  cityscape: "#B0C4DE",
  barren: "#D2B48C",
  tundra: "#ADD8E6",
  ice: "#00FFFF",
  rocky: "#808080",
  savanna: "#DDA520",
  unknown: "#FFFFFF",
};

const climateColors: { [key: string]: string } = {
  arid: "#F4A460",
  temperate: "#FFD700",
  tropical: "#FF4500",
  frozen: "#ADD8E6",
  humid: "#8B4513",
  windy: "#778899",
  murky: "#6B8E23",
  unknown: "#FFFFFF",
};

const speedFactor = 0.005;

const PlanetsGraph: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPlanets().then((data) => {
      const sortedPlanets = data.sort(
        (a, b) => parseInt(b.diameter) - parseInt(a.diameter)
      );
      setPlanets(sortedPlanets);
    });
  }, []);

  useEffect(() => {
    if (planets.length > 0) {
      drawChart(planets);
    }
  }, [planets]);

  const drawChart = (data: Planet[]) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;

    const svgElement = d3.select(ref.current).select("svg");
    if (!svgElement.empty()) {
      svgElement.remove();
    }

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background-color", "black")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3
      .select(ref.current)
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("box-shadow", "0px 0px 6px #aaa")
      .style("pointer-events", "none")
      .style("visibility", "hidden");

    const maxDiameter = d3.max(data, (d) => parseInt(d.diameter)) || 0;
    const maxPopulation = d3.max(data, (d) => parseInt(d.population)) || 0;

    const x = d3.scaleLinear().domain([0, data.length]).range([0, width]);

    const y = d3.scaleLinear().domain([0, maxDiameter]).range([height, 0]);

    const defs = svg.append("defs");

    data.forEach((d, i) => {
      const terrain = d.terrain.split(",")[0].trim();
      const climate = d.climate.split(",")[0].trim();
      const surfaceWater = parseInt(d.surface_water);

      const gradient = defs
        .append("radialGradient")
        .attr("id", `gradient-${i}`)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "50%")
        .attr("fy", "50%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", terrainColors[terrain] || terrainColors.unknown);

      gradient
        .append("stop")
        .attr("offset", "50%")
        .attr("stop-color", climateColors[climate] || climateColors.unknown);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", surfaceWater > 0 ? "blue" : "black");
    });

    const orbits = svg
      .selectAll(".orbit")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "orbit")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", (_, i) => 50 + i * 30)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);

    const planets = svg
      .selectAll(".planet")
      .data(data)
      .enter()
      .append<SVGCircleElement>("circle")
      .attr("class", "planet")
      .attr("r", (d) =>
        parseInt(d.diameter) > 0 ? parseInt(d.diameter) / 2000 : 3
      )
      .attr("fill", (_, i) => `url(#gradient-${i})`)
      .attr("stroke", "black")
      .on("mouseover", function (event, d) {
        tooltip
          .html(
            `<strong>${d.name}</strong><br/>
          <strong>Climate:</strong> ${d.climate}<br/>
          <strong>Terrain:</strong> ${d.terrain}<br/>
          <strong>Population:</strong> ${d.population}<br/>
          <strong>Gravity:</strong> ${d.gravity}<br/>
          <strong>Surface Water:</strong> ${d.surface_water}%<br/>
          <strong>Diameter:</strong> ${d.diameter}`
          )
          .style("visibility", "visible")
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    planets.each(function (d, i) {
      const planet = d3.select<SVGCircleElement, Planet>(this);
      const orbitalPeriod = parseFloat(d.orbital_period);
      if (isFinite(orbitalPeriod) && orbitalPeriod > 0) {
        animatePlanet(planet, 50 + i * 30, orbitalPeriod);
      }
    });

    const stars = d3.range(200).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    svg
      .selectAll(".star")
      .data(stars)
      .enter()
      .append<SVGCircleElement>("circle")
      .attr("class", "star")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 1)
      .attr("fill", "white");

    function animatePlanet(
      planet: d3.Selection<SVGCircleElement, Planet, null, undefined>,
      orbitRadius: number,
      orbitalPeriod: number
    ) {
      const angleScale = d3
        .scaleLinear()
        .domain([0, orbitalPeriod])
        .range([0, 2 * Math.PI]);

      const path = d3.path();
      path.arc(width / 2, height / 2, orbitRadius, 0, 2 * Math.PI);
      const pathString = path.toString();
      const pathEl = svg
        .append("path")
        .attr("d", pathString)
        .attr("fill", "none")
        .attr("stroke", "none");

      const length = pathEl.node()?.getTotalLength() || 0;

      d3.timer((elapsed) => {
        const adjustedElapsed = elapsed * speedFactor;
        const progress = (adjustedElapsed % orbitalPeriod) / orbitalPeriod;
        const point = pathEl.node()?.getPointAtLength(progress * length);
        if (point) {
          planet.attr("cx", point.x).attr("cy", point.y);
        }
      });
    }
  };

  return (
    <PageContainer>
      <div ref={ref} style={{ width: "100%", height: "100%" }} />
    </PageContainer>
  );
};

export default PlanetsGraph;
