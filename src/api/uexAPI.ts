import { log } from "../logging/logger";
import type { UEXShip } from "../types/uex";
import { time_week_seconds } from "../utilities/general";
import { RedisClient } from "../utilities/redis";

const UEXAPI = "https://uexcorp.space/api/2.0/";
const VEHICLESENDPOINT = `${UEXAPI}vehicles`;
const VEHICLESFROMBRANDENDPOINT = `${VEHICLESENDPOINT}?id_company=`;

export let UEXShips: Array<UEXShip> = [];

export async function FetchUEXVehicles() {
    log.info("Fetching ships from UEX...");

    const cache = await RedisClient.get("UEX:Ships");

    if (cache === null) {
        log.info("...No cache found. Updating...");
        const fetchShips = await fetch(VEHICLESENDPOINT, {
            method: "GET",
            headers: {
                api_key: process.env.UEX,
            },
        });

        if (fetchShips.status !== 200) {
            log.error(
                `UEX returned a non-OK status. code: ${fetchShips.status} - ${fetchShips.statusText}`
            );
            return;
        }
        const data: UEXShip[] = (await fetchShips.json()).data;
        UEXShips = data;
        RedisClient.set("UEX:Ships", JSON.stringify(data));
        // set expiry for 2 weeks
        RedisClient.expire("UEX:Ships", time_week_seconds * 2);
        log.info("...Done!");
        return;
    }

    log.info("...Found UEX vehicle cache. Done!");
    UEXShips = JSON.parse(cache);

    return;
}

export async function FetchUEXBrandVehicles(
    brand: string
): Promise<UEXShip[] | Error> {
    const cache = await RedisClient.get(`UEX:Ships-${brand}`);

    if (cache === null) {
        log.info(`No cache found for brand ${brand}`);

        const fetchShips = await fetch(VEHICLESFROMBRANDENDPOINT + brand, {
            method: "GET",
            headers: {
                api_key: process.env.UEX,
            },
        });

        if (fetchShips.status !== 200) {
            return new Error(
                `UEX returned a non-OK status. code: ${fetchShips.status} - ${fetchShips.statusText}`
            );
        }
        const data: UEXShip[] = (await fetchShips.json()).data;
        RedisClient.set(`UEX:Ships-${brand}`, JSON.stringify(data));
        // set expiry for 2 weeks
        RedisClient.set(`UEX:Ships-${brand}`, time_week_seconds * 2);
        return data;
    }

    log.info(`found a cached list of vehicles for brand "${brand}"`);
    return JSON.parse(cache);
}
