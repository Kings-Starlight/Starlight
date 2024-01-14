import { log } from "@logging/logger";
import { UEXShip, Tradeport, TradeportPrices, Planet } from "@/src/types/uex";
import { RedisClient } from "@utilities/redis";

export var UEXShips: UEXShip[];
export var UEXTradePorts: Tradeport[];
export var Planets: Planet[];
export var Satellites: Planet[];

const UEXAPIBASE = "https://portal.uexcorp.space/api/";

/**
 * FetchUEXVehicles returns an array of ships and vehicles within StarCitizen.
 */
export async function FetchUEXVehicles() {
    log.info("Fetching ships from UEX...");

    const cache = await RedisClient.get("UEX:Ships");

    if (cache === null) {
        log.info("...No cache found. Updating...");
        const fetchShips = await fetch(UEXAPIBASE + "ships", {
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
        RedisClient.expire("UEX:Ships", 86400 * 14);
        log.info("...Done!");
        return;
    }

    log.info("...Found UEX vehicle cache. Done!");
    UEXShips = JSON.parse(cache);
    return;
}

/**
 * FetchUEXTradeports returns all locations within a system that provides the ability to buy, or sell goods.
 * The Stanton system is used by default.
 */
export async function FetchUEXTradeports() {
    log.info("Fetching UEX tradeports...");

    const cache = await RedisClient.get("UEX:Tradeports");

    if (cache === null) {
        log.info("...No cache found. Updating...");
        const fetchTradeports = await fetch(
            UEXAPIBASE + "tradeports/system/ST/",
            {
                method: "GET",
                headers: {
                    api_key: process.env.UEX,
                },
            }
        );
        if (fetchTradeports.status !== 200) {
            log.error(
                `UEX returned a non-OK status. code: ${fetchTradeports.status} - ${fetchTradeports.statusText}`
            );
            return;
        }
        const data: Tradeport[] = (await fetchTradeports.json()).data;
        data.forEach((tradeport: Tradeport, i: number) => {
            if (tradeport.prices != undefined) {
                var pricesNew: TradeportPrices[] = Object.entries(
                    tradeport.prices
                ).map((e: [string, TradeportPrices]) => ({
                    name: e[1].name,
                    kind: e[1].kind,
                    code: e[0],
                    operation: e[1].operation,
                    price_buy: e[1].price_buy,
                    price_sell: e[1].price_sell,
                    date_update: e[1].date_update,
                    is_updated: e[1].is_updated,
                }));
                data[i].space = Boolean(Number(tradeport.space));
                data[i].visible = Boolean(Number(tradeport.visible));
                data[i].armistice = Boolean(Number(tradeport.armistice));
                data[i].trade = Boolean(Number(tradeport.trade));
                data[i].outlaw = Boolean(Number(tradeport.outlaw));
                data[i].refinery = Boolean(Number(tradeport.refinery));
                data[i].shops = Boolean(Number(tradeport.shops));
                data[i].restricted = Boolean(Number(tradeport.restricted));
                data[i].prices = pricesNew;
            }
        });
        RedisClient.set("UEX:Tradeports", JSON.stringify(data));
        // set expiry for 2 weeks
        RedisClient.expire("UEX:Tradeports", 86400 * 14);
        UEXTradePorts = data;
        log.info("...Done!");
        return;
    }
    log.info("...Found UEX tradport cache. Done!");
    UEXTradePorts = JSON.parse(cache);
    return;
}

/**
 * FetchPlanets returns an array of all planets within a system.
 * The Stanton system is used by default.
 */
export async function FetchPlanets() {
    log.info("Fetching UEX planets...");
    const cache = await RedisClient.get("UEX:Planets");

    if (cache === null) {
        log.info("...No cache found. Updating...");
        const fetchPlanets = await fetch(UEXAPIBASE + "planets/system/ST", {
            method: "GET",
            headers: {
                api_key: process.env.UEX,
            },
        });
        if (fetchPlanets.status !== 200) {
            log.error(
                `UEX returned a non-OK status. code: ${fetchPlanets.status} - ${fetchPlanets.statusText}`
            );
            return;
        }
        var data: Planet[] = (await fetchPlanets.json()).data;
        RedisClient.set("UEX:Planets", JSON.stringify(data));
        // set expiry for 2 weeks
        RedisClient.expire("UEX:Planets", 86400 * 14);
        Planets = data;
        log.info("...Done!");
        return;
    }
    log.info("...Found UEX planets cache. Done!");
    Planets = JSON.parse(cache);
    return;
}

/**
 * FetchSatellites returns an array of all planetary satellites within a system.
 * The Stanton system is used by default.
 */
export async function FetchSatellites() {
    log.info("Fetching UEX satellites...");
    const cache = await RedisClient.get("UEX:Satellites");
    if (cache === null) {
        log.info("...No cache found. Updating...");

        const fetchSatellites = await fetch(
            UEXAPIBASE + "satellites/system/ST",
            {
                method: "GET",
                headers: {
                    api_key: process.env.UEX,
                },
            }
        );
        if (fetchSatellites.status !== 200) {
            log.error(
                `UEX returned a non-OK status. code: ${fetchSatellites.status} - ${fetchSatellites.statusText}`
            );
            return;
        }

        var data: Planet[] = (await fetchSatellites.json()).data;
        RedisClient.set("UEX:Satellites", JSON.stringify(data));
        // set expiry for 2 weeks
        RedisClient.expire("UEX:Satellites", 86400 * 14);
        Satellites = data;
        log.info("...Done!");
        return;
    }
    log.info("...Found UEX satellites cache. Done!");
    Satellites = JSON.parse(cache);
    return;
}
