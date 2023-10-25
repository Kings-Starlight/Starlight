import { log } from "../logging/logger";
import {
    GalactapediaResult,
    SearchResponse,
    WikiShip,
    Manufacturer,
    ManufacturerShort,
} from "../types/sc_wiki";

const WikiAPI = "https://api.star-citizen.wiki/api/v2/";

export var ships: SearchResponse[];
export var manufacturers: ManufacturerShort[];

/**
 * RetrieveVehicleInfo takes a "name" param, and returns details about the specified vehicle.
 * @param name Name of the ship or vehicle.
 * @returns WikiShip
 */
export async function RetrieveVehicleInfo(name: string): Promise<WikiShip> {
    const fetchShip = await fetch(
        WikiAPI + `vehicles/${name}?include=components,hardpoints,shops`
    );
    var response: WikiShip = (await fetchShip.json()).data;

    if (!Array.isArray(response.foci)) {
        log.debug(`Converting foci for ${response.name} to array...`);
        response.foci = [response.foci];
    }
    return response;
}

/**
 * SearchVehicles takes a "query" param, and returns an array of ships matching the query.
 * @param query Name or partial name of the ship or vehicle.
 * @returns SearchRespons[]
 */
export async function SearchVehicles(query: string): Promise<SearchResponse[]> {
    const search = await fetch(WikiAPI + "vehicles/search", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });
    return await search.json();
}

/**
 * FetchVehicles saves an array of all ships and vehicles.
 */
export async function FetchVehicles(): Promise<void> {
    log.info("Fetching list of ships from Wiki");
    log.profile("get Wiki vehicles");
    const search = await fetch(WikiAPI + "vehicles?limit=500");
    log.profile("get Wiki vehicles");

    ships = (await search.json()).data;
}

/**
 * FetchManufacturers saves an array of all ship and vehicle manufacturers
 */
export async function FetchManufacturers(): Promise<void> {
    log.info("Fetching list of manufacturers from Wiki");
    log.profile("get Wiki manufacturers");
    const search = await fetch(WikiAPI + "manufacturers?limit=500");
    log.profile("get Wiki manufacturers");

    manufacturers = (await search.json()).data;
}

/**
 * FetchVehicleSerie returns an array of all ships within the same chassis series as the provided chassis_id
 * @param chassis_id the ID of a ship series chassis platform
 * @returns SearchResponse[]
 */
export async function FetchVehicleSerie(
    chassis_id: number
): Promise<SearchResponse[]> {
    const search = await fetch(
        WikiAPI + `vehicles?filter[chassis_id]=${chassis_id}`
    );
    return (await search.json()).data;
}

/**
 * SearchGalactapedia takes a query and forwards it to the RSI Galactapedia, returns the contents as an array of results.
 * @param query
 * @returns GalactapediaResult[]
 */
export async function SearchGalactapedia(
    query: string
): Promise<GalactapediaResult[]> {
    const search = await fetch(WikiAPI + "galactapedia/search", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });
    return (await search.json()).data;
}
