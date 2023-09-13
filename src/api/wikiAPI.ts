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

export async function RetrieveVehicleInfo(name: string): Promise<WikiShip> {
    const fetchShip = await fetch(
        WikiAPI + `vehicles/${name}?include=components,hardpoints,shops`
    );
    return (await fetchShip.json()).data;
}

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

export async function FetchVehicles(): Promise<void> {
    log.info("Fetching list of ships from Wiki");
    log.profile("get Wiki vehicles");
    const search = await fetch(WikiAPI + "vehicles?limit=500");
    log.profile("get Wiki vehicles");

    ships = (await search.json()).data;
}

export async function FetchManufacturers(): Promise<void> {
    log.info("Fetching list of manufacturers from Wiki");
    log.profile("get Wiki manufacturers");
    const search = await fetch(WikiAPI + "manufacturers?limit=500");
    log.profile("get Wiki manufacturers");

    manufacturers = (await search.json()).data;
}

export async function FetchVehicleSerie(
    chassis_id: number
): Promise<SearchResponse[]> {
    const search = await fetch(
        WikiAPI + `vehicles?filter[chassis_id]=${chassis_id}`
    );
    return (await search.json()).data;
}

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
