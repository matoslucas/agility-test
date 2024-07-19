export interface Planet {
    name: string;
    terrain: string;
    diameter: string;
    population: string;
    climate: string;
    gravity: string;
    surface_water: string;
    orbital_period: string;
}

export type SWAPIPlanetResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Planet[];
    
} | undefined;

export type Character = {
    name: string;
}