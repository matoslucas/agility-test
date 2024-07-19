import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CharacterSearch from "./components/pages/CharacterSearch";
import TerrainChart from "./components/pages/TerrainChart";
import PlanetsGraph from "./components/pages/PlanetsGraph";
import Nav from "./components/layout/Nav";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<PlanetsGraph />} />
          <Route path="/character-search" element={<CharacterSearch />} />
          <Route path="/terrain-chart" element={<TerrainChart />} />
          <Route path="/planets" element={<PlanetsGraph />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
