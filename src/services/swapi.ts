import { json } from "d3-fetch";
import { SWAPIPlanetResponse, Planet } from "../types";

const SWAPI_URL = `https://swapi.dev/api`;

export async function fetchCharacter(name: string): Promise<any> {
  try {
    const response = await fetch(`${SWAPI_URL}/people/?search=${name}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results.length > 0 ? data.results : null; // Return null if no results to indicate not found.
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fetching error:", error.message);
      throw new Error(error.message); // Re-throw to be handled by the component
    }
    throw new Error("Unexpected error"); // For unknown errors
  }
}

export async function fetchPlanetsTerrain(): Promise<
  { name: string; terrain: string[] }[]
> {
  const planets: Planet[] = [];
  let nextUrl: string | null = `${SWAPI_URL}/planets/`;

  while (nextUrl) {
    const response: SWAPIPlanetResponse = await json<SWAPIPlanetResponse>(
      nextUrl
    );
    if (!response) {
      throw new Error("Failed to fetch data from SWAPI.");
    }
    planets.push(...response.results);
    nextUrl = response.next;
  }

  return planets.map((planet) => ({
    name: planet.name,
    terrain: planet.terrain.split(",").map((t: string) => t.trim()),
  }));
}

export async function fetchPlanets(): Promise<Planet[]> {
  const planets: Planet[] = [];
  let nextUrl: string | null = "https://swapi.dev/api/planets/";

  while (nextUrl) {
    const response: SWAPIPlanetResponse = await json(nextUrl);
    if (response) {
      planets.push(...response.results);
      nextUrl = response.next;
    }
  }

  return planets;
}
