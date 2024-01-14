import { log } from "@logging/logger";
import {
    GalactapediaResult,
    SearchResponse,
    WikiShip,
    ManufacturerShort,
} from "@/src/types/sc_wiki";
import { RedisClient } from "@utilities/redis";

const WikiAPI = "https://api.star-citizen.wiki/api/v2/";

export var Ships: SearchResponse[];
export var Manufacturers: ManufacturerShort[];

/**
 * RetrieveVehicleInfo takes a "name" param, and returns details about the specified vehicle.
 * @param name Name of the ship or vehicle.
 * @returns WikiShip
 */
export async function RetrieveVehicleInfo(name: string): Promise<any> {
    var data: WikiShip = (await RedisClient.json.get(name)) as any;

    if (data === null) {
        const fetchShip = await fetch(
            WikiAPI + `vehicles/${name}?include=components,hardpoints,shops`
        );
        if (fetchShip.status !== 200) {
            log.error(
                `Wiki returned a non-OK status. code: ${fetchShip.status} - ${fetchShip.statusText}`
            );
            return Promise.reject(
                `Wiki returned a non-OK status. code: ${fetchShip.status} - ${fetchShip.statusText}`
            );
        }
        var response: WikiShip = (await fetchShip.json()).data;

        if (!Array.isArray(response.foci)) {
            log.debug(`Converting foci for ${response.name} to array...`);
            response.foci = [response.foci];
        }

        RedisClient.json.set("vehicle:" + response.slug, "$", response as any);
        RedisClient.expire("vehicle:" + response.slug, 86400 * 7, "NX");
        return response;
    }
    return data;
}

/**
 * SearchVehicles takes a "query" param, and returns an array of ships matching the query.
 * @param query Name or partial name of the ship or vehicle.
 * @returns SearchResponse[]
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
    if (search.status !== 200) {
        log.error(
            `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
        return Promise.reject(
            `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
    }
    return await search.json();
}

/**
 * FetchVehicles saves an array of all ships and vehicles.
 */
export async function FetchVehicles(): Promise<void> {
    log.info("Fetching list of ships from Wiki...");
    log.profile("get Wiki vehicles");
    const cache = (await RedisClient.json.get("Wiki:WikiShips")) as any;
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(WikiAPI + "vehicles?limit=500");
        if (search.status !== 200) {
            log.error(
                `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        var data = (await search.json()).data;
        RedisClient.json.set("Wiki:WikiShips", "$", data);
        // set expiry for 2 weeks.
        RedisClient.expire("Wiki:WikiShips", 86400 * 14);
        log.info("...Done!");

        Ships = data;
        return;
    }
    log.info("...Found wiki vehicles cache. Done!");

    Ships = cache;
    return;
}

/**
 * FetchManufacturers saves an array of all ship and vehicle manufacturers
 */
export async function FetchManufacturers(): Promise<void> {
    log.info("Fetching list of manufacturers from Wiki");
    log.profile("get Wiki manufacturers");
    const cache = (await RedisClient.json.get("Wiki:WikiManufacturers")) as any;

    if (cache === null) {
        log.info("...No cache found. updating...");

        const search = await fetch(WikiAPI + "manufacturers?limit=1000");
        if (search.status !== 200) {
            log.error(
                `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        var data = (await search.json()).data;

        RedisClient.json.set("Wiki:WikiManufacturers", "$", data);
        // set no point expiring this information. it basically never changes...

        Manufacturers = data;
        log.info("...Done!");
        return;
    }
    log.info("...Found wiki manufacturers cache. Done!");
    Manufacturers = cache;
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
    if (search.status !== 200) {
        log.error(
            `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
        return Promise.reject(
            `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
    }
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
    if (search.status !== 200) {
        log.error(
            `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
        return Promise.reject(
            `Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
    }
    return (await search.json()).data;
}
