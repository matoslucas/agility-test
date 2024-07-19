import { Link } from "react-router-dom";
const Nav: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around">
        <li>
          <Link to="/" className="text-white">
            Home
          </Link>
        </li>
        <li>
          <Link to="/character-search" className="text-white">
            Character Search
          </Link>
        </li>
        <li>
          <Link to="/planets" className="text-white">
            PlanetsGraph
          </Link>
        </li>
        <li>
          <Link to="/terrain-chart" className="text-white">
            Terrain Chart
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Nav;
