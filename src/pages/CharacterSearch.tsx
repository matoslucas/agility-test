import React, { useState } from "react";
import { fetchCharacter } from "../services/swapi";
import SearchBar from "../forms/SearchBar";
import PageContainer from "../layout/PageContainer";
import SearchResult from "../components/SearchResult";

const CharacterSearch: React.FC = () => {
  const [name, setName] = useState("");
  const [characters, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!name.trim()) {
      setError("Please enter a character name.");
      return;
    }

    setLoading(true);
    setError("");
    setCharacter(null);

    try {
      const data = await fetchCharacter(name);
      if (data) {
        setCharacter(data);
      } else {
        setError("Character not found.");
      }
    } catch (error) {
      setError(
        "Failed to fetch character data. Please check your network connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log(characters);
  return (
    <PageContainer>
      <SearchBar
        placeholder="Enter character name"
        disabled={loading || !name.trim()}
        onChange={(e) => setName(e.target.value)}
        onClick={handleSearch}
      />

      <SearchResult loading={loading} error={error} characters={characters}/>

    </PageContainer>
  );
};

export default CharacterSearch;
