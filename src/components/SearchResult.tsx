import { Character } from "../types";

type SearchResultProps = {
  loading: boolean;
  error: string;
  characters: Character[];
};
const SearchResult: React.FC<SearchResultProps> = (props) => {
  const { loading, error, characters } = props;
  return (
    <div className="max-w-md mx-auto text-white p-8">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {characters &&
        characters.map((c) => {
          return (
            <li>
              <span className="text-2xl">{c.name}</span>
            </li>
          );
        })}
    </div>
  );
};

export default SearchResult;
