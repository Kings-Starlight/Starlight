import { log } from "@logging/logger";
import {
    GalactapediaResult,
    SearchResponse,
    WikiShip,
    ManufacturerShort,
    FPSItemShort,
    Weapon,
    MasterItem,
    WikiResponse,
} from "@/src/types/sc_wiki";
import { RedisClient } from "@utilities/redis";

const WikiAPI = "https://api.star-citizen.wiki/api/v2/";

export let Ships: SearchResponse[];
export let Manufacturers: ManufacturerShort[];
export let Weapons: Weapon[];
export let Food: FPSItemShort[];
export let Clothes: FPSItemShort[];
export let Armor: FPSItemShort[];
export let Items: FPSItemShort[];
export let WeaponAttachments: FPSItemShort[];
export let VehicleWeapons: FPSItemShort[];
export let VehicleItems: FPSItemShort[];

export async function RequestImage(title: string) {
    const props = {
        action: "query",
        format: "json",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: 640 * 2,
        formatversion: 2,
        titles: title.replace(/\s/g, "_"),
    };

    const url = new URL("https://star-citizen.wiki/api.php");

    for (const [k, v] of Object.entries(props)) {
        url.searchParams.append(k, v.toString());
    }

    const response = await fetch(url, {
        method: "GET",
    });

    const result: WikiResponse = await response.json();

    if (
        response.status !== 200 ||
        result.batchcomplete !== true ||
        result.query.pages.length === 0
    ) {
        return null;
    }

    let image = null;

    for (const page of result.query.pages.filter(
        (page) => page?.missing !== true
    )) {
        if (typeof page.thumbnail !== "undefined") {
            image = page.thumbnail.source.replace("50px-", "800px-");
        }
    }

    return image;
}

/**
 * RetrieveVehicleInfo takes a "name" param, and returns details about the specified vehicle.
 * @param name Name of the ship or vehicle.
 * @returns WikiShip
 */
export async function RetrieveVehicleInfo(name: string): Promise<WikiShip> {
    const data = await RedisClient.get(name);

    if (data === null) {
        const fetchShip = await fetch(
            `${WikiAPI}vehicles/${name}?include=components,hardpoints,shops`
        );

        if (fetchShip.status !== 200) {
            log.error(
                `Failed to retrieve ship. Wiki returned a non-OK status. code: ${fetchShip.status} - ${fetchShip.statusText}`
            );
            return Promise.reject(
                `Failed to retrieve ship. Wiki returned a non-OK status. code: ${fetchShip.status} - ${fetchShip.statusText}`
            );
        }
        const response: WikiShip = (await fetchShip.json()).data;

        if (!Array.isArray(response.foci)) {
            log.debug(`Converting foci for ${response.name} to array...`);
            response.foci = [response.foci];
        }

        RedisClient.set(`vehicle:${response.slug}`, JSON.stringify(response));
        RedisClient.expire(`vehicle:${response.slug}`, 86400 * 7, "NX");
        return response;
    }
    return JSON.parse(data);
}

/**
 * SearchVehicles takes a "query" param, and returns an array of ships matching the query.
 * @param query Name or partial name of the ship or vehicle.
 * @returns SearchResponse[]
 */
export async function SearchVehicles(query: string): Promise<SearchResponse[]> {
    const search = await fetch(`${WikiAPI}vehicles/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });
    if (search.status !== 200) {
        log.error(
            `Failed to search vehicles. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
        return Promise.reject(
            `Failed to search vehicles. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
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
    const cache = await RedisClient.get("Wiki:WikiShips");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}vehicles?limit=500`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch all vehicles. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch all vehicles. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data;
        RedisClient.set("Wiki:WikiShips", JSON.stringify(data));
        // set expiry for 2 weeks.
        RedisClient.expire("Wiki:WikiShips", 86400 * 14);
        log.info("...Done!");

        Ships = data;
        return;
    }
    log.info("...Found wiki vehicles cache. Done!");

    Ships = JSON.parse(cache);
    return;
}

/**
 * FetchManufacturers saves an array of all ship and vehicle manufacturers
 */
export async function FetchManufacturers(): Promise<void> {
    log.info("Fetching list of manufacturers from Wiki");
    log.profile("get Wiki manufacturers");
    const cache = await RedisClient.get("Wiki:WikiManufacturers");

    if (cache === null) {
        log.info("...No cache found. updating...");

        const search = await fetch(`${WikiAPI}manufacturers?limit=1000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch all manufacturers. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch all manufacturers. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data;

        RedisClient.set("Wiki:WikiManufacturers", JSON.stringify(data));
        // set no point expiring this information. it basically never changes...

        Manufacturers = data;
        log.info("...Done!");
        return;
    }
    log.info("...Found wiki manufacturers cache. Done!");
    Manufacturers = JSON.parse(cache);
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
        `${WikiAPI}vehicles?filter[chassis_id]=${chassis_id}`
    );
    if (search.status !== 200) {
        log.error(
            `Failed to search vehicle serie. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
        );
        return Promise.reject(
            `Failed to search vehicle serie. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
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
): Promise<GalactapediaResult[] | null> {
    const search = await fetch(`${WikiAPI}galactapedia/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });
    return (await search.json()).data;
}

export async function FetchVehicleWeapons() {
    log.info("Fetching list of vehicle weapons from Wiki...");
    log.profile("get Wiki vehicles Weapons");
    const cache = await RedisClient.get("Wiki:WikiVehicleWeapons");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}vehicle-weapons?limit=5000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch vehicle weapons. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch vehicle weapons. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data
            .filter((item: MasterItem) =>
                item.name === "<= PLACEHOLDER =>" ? false : true
            )
            .filter(
                (arr: MasterItem, index: number, self: MasterItem[]) =>
                    index ===
                    self.findIndex(
                        (t: MasterItem) =>
                            t.name === arr.name &&
                            t.description === arr.description
                    )
            );
        RedisClient.set("Wiki:WikiVehicleWeapons", JSON.stringify(data));
        log.info("...Done!");

        VehicleWeapons = data;
        return;
    }
    log.info("...Found wiki vehicle weapons cache. Done!");

    VehicleWeapons = JSON.parse(cache);
    log.profile("get Wiki vehicles Weapons");
    return;
}
export async function FetchVehicleItems() {
    log.info("Fetching list of vehicle items from Wiki...");
    log.profile("get Wiki vehicles Items");
    const cache = await RedisClient.get("Wiki:WikiVehicleItems");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}vehicle-items?limit=5000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch vehicle items. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch vehicle items. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data
            .filter((item: MasterItem) =>
                item.name === "<= PLACEHOLDER =>" ? false : true
            )
            .filter(
                (arr: MasterItem, index: number, self: MasterItem[]) =>
                    index ===
                    self.findIndex(
                        (t: MasterItem) =>
                            t.name === arr.name &&
                            t.description === arr.description
                    )
            );
        RedisClient.set("Wiki:WikiVehicleItems", JSON.stringify(data));
        log.info("...Done!");

        VehicleItems = data;
        return;
    }
    log.info("...Found wiki vehicles items cache. Done!");

    VehicleItems = JSON.parse(cache);
    log.profile("get Wiki vehicles Items");
    return;
}
export async function FetchFPSWeapons() {
    log.info("Fetching list of Weapons from Wiki...");
    log.profile("get Wiki FPS Weapons");
    const cache = await RedisClient.get("Wiki:WikiWeapons");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}weapons?limit=5000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch fps weapons. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch fps weapons. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data
            .filter((item: MasterItem) =>
                item.name === "<= PLACEHOLDER =>" ? false : true
            )
            .filter(
                (arr: MasterItem, index: number, self: MasterItem[]) =>
                    index ===
                    self.findIndex(
                        (t: MasterItem) =>
                            t.name === arr.name &&
                            t.description === arr.description
                    )
            );
        RedisClient.set("Wiki:WikiWeapons", JSON.stringify(data));
        log.info("...Done!");

        Weapons = data;
        return;
    }
    log.info("...Found wiki weapons cache. Done!");

    Weapons = JSON.parse(cache);
    log.profile("get Wiki FPS Weapons");
    return;
}
export async function FetchFPSWeaponAttachments() {
    log.info("Fetching list of weapon attachments from Wiki...");
    log.profile("get Wiki Weapon Attachments");
    const cache = await RedisClient.get("Wiki:WikiWeaponAttachments");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}weapon-attachments?limit=5000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch weapon attachments. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch weapon attachments. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data
            .filter((item: MasterItem) =>
                item.name === "<= PLACEHOLDER =>" ? false : true
            )
            .filter(
                (arr: MasterItem, index: number, self: MasterItem[]) =>
                    index ===
                    self.findIndex(
                        (t: MasterItem) =>
                            t.name === arr.name &&
                            t.description === arr.description
                    )
            );
        RedisClient.set("Wiki:WikiWeaponAttachments", JSON.stringify(data));
        log.info("...Done!");

        WeaponAttachments = data;
        return;
    }
    log.info("...Found wiki weapon attachments cache. Done!");

    WeaponAttachments = JSON.parse(cache);
    log.profile("get Wiki Weapon Attachments");
    return;
}
export async function FetchFPSItems() {
    log.info("Fetching list of items from Wiki...");
    log.profile("get Wiki items");
    const cache = await RedisClient.get("Wiki:WikiFPSItems");
    if (cache === null) {
        let page = 1;
        const temp: FPSItemShort[] = [];
        let newItems = true;
        let newLink = `${WikiAPI}items?limit=500`;
        log.info("...No cache found. updating...");
        while (newItems) {
            const search = await fetch(newLink);
            if (search.status !== 200) {
                log.error(
                    `Failed to fetch items. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
                );
                return Promise.reject(
                    `Failed to fetch items. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
                );
            }
            const data = await search.json();
            temp.push(
                ...data.data
                    .filter((item: MasterItem) =>
                        item.name === "<= PLACEHOLDER =>" ? false : true
                    )
                    .filter(
                        (arr: MasterItem, index: number, self: MasterItem[]) =>
                            index ===
                            self.findIndex(
                                (t: MasterItem) =>
                                    t.name === arr.name &&
                                    t.description === arr.description
                            )
                    )
            );
            if (data.links.next !== null) {
                log.debug(`wiki items page: ${page} traversed.`);
                page++;
                newLink = data.links.next;
                continue;
            }
            newItems = false;
        }
        RedisClient.set("Wiki:WikiFPSItems", JSON.stringify(temp));
        log.info("...Done!");

        Items = temp;
        return;
    }
    log.info("...Found wiki items cache. Done!");

    Items = JSON.parse(cache);
    log.profile("get Wiki items");
    return;
}
export async function FetchFood() {
    log.info("Fetching list of food from Wiki...");
    log.profile("get Wiki food");
    const cache = await RedisClient.get("Wiki:WikiFood");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}food?limit=5000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch food. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch food. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data
            .filter((item: MasterItem) =>
                item.name === "<= PLACEHOLDER =>" ? false : true
            )
            .filter(
                (arr: MasterItem, index: number, self: MasterItem[]) =>
                    index ===
                    self.findIndex(
                        (t: MasterItem) =>
                            t.name === arr.name &&
                            t.description === arr.description
                    )
            );
        RedisClient.set("Wiki:WikiFood", JSON.stringify(data));
        log.info("...Done!");

        Food = data;
        return;
    }
    log.info("...Found wiki Food cache. Done!");

    Food = JSON.parse(cache);
    log.profile("get Wiki food");
    return;
}
export async function FetchClothes() {
    log.info("Fetching list of clothing from Wiki...");
    log.profile("get Wiki clothes");
    const cache = await RedisClient.get("Wiki:WikiClothes");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}clothes?limit=5000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch clothes. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch clothes. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data
            .filter((item: MasterItem) =>
                item.name === "<= PLACEHOLDER =>" ? false : true
            )
            .filter(
                (arr: MasterItem, index: number, self: MasterItem[]) =>
                    index ===
                    self.findIndex(
                        (t: MasterItem) =>
                            t.name === arr.name &&
                            t.description === arr.description
                    )
            );
        RedisClient.set("Wiki:WikiClothes", JSON.stringify(data));
        log.info("...Done!");

        Clothes = data;
        return;
    }
    log.info("...Found wiki clothes cache. Done!");

    Clothes = JSON.parse(cache);
    return;
}
export async function FetchArmour() {
    log.info("Fetching list of armor from Wiki...");
    log.profile("get Wiki armor");
    const cache = await RedisClient.get("Wiki:WikiArmor");
    if (cache === null) {
        log.info("...No cache found. updating...");
        const search = await fetch(`${WikiAPI}armor?limit=5000`);
        if (search.status !== 200) {
            log.error(
                `Failed to fetch armor. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
            return Promise.reject(
                `Failed to fetch armor. Wiki returned a non-OK status. code: ${search.status} - ${search.statusText}`
            );
        }
        const data = (await search.json()).data
            .filter((item: MasterItem) =>
                item.name === "<= PLACEHOLDER =>" ? false : true
            )
            .filter(
                (arr: MasterItem, index: number, self: MasterItem[]) =>
                    index ===
                    self.findIndex(
                        (t: MasterItem) =>
                            t.name === arr.name &&
                            t.description === arr.description
                    )
            );
        RedisClient.set("Wiki:WikiArmor", JSON.stringify(data));
        log.info("...Done!");

        Armor = data;
        return;
    }
    log.info("...Found wiki Armor cache. Done!");

    Armor = JSON.parse(cache);
    return;
}

/**
 * Retrieves information about a specific item from the Wiki api
 * @param id The unique id of the item to retrieve
 * @returns {Promise<MasterItem>} Returns a promise containing a JSON instance of the requested item
 */
export async function FetchItemInfo(id: string): Promise<MasterItem> {
    const data = await RedisClient.get(id);
    if (data === null) {
        const fetchItem = await fetch(`${WikiAPI}items/${id}`);
        const response: MasterItem = (await fetchItem.json()).data;

        if (fetchItem.status !== 200) {
            log.error(
                `Failed to fetch item info. Wiki returned a non-OK status. code: ${fetchItem.status} - ${fetchItem.statusText}`
            );
            return Promise.reject(
                `Failed to fetch item info. Wiki returned a non-OK status. code: ${fetchItem.status} - ${fetchItem.statusText}`
            );
        }

        RedisClient.set(`Items:${response.uuid}`, JSON.stringify(response));
        return response;
    }
    return JSON.parse(data);
}
