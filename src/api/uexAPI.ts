import { log } from "../logging/logger";
import { UEXShip, Tradeport, TradeportPrices, Planet } from "../types/uex";

export var UEXShips: UEXShip[];
export var UEXTradePorts: Tradeport[];
export var Planets: Planet[];
export var Satellites: Planet[];

const UEXAPIBASE = "https://portal.uexcorp.space/api/";

/**
 * FetchUEXVehicles returns an array of ships and vehicles within StarCitizen.
 */
export async function FetchUEXVehicles() {
    log.info("Fetching ships from UEX");
    log.profile("get UEX vehicles");
    const fetchShips = await fetch(UEXAPIBASE + "ships", {
        method: "GET",
        headers: {
            api_key: process.env.UEX,
        },
    });

    UEXShips = (await fetchShips.json()).data;
    log.profile("get UEX vehicles");
}

/**
 * FetchUEXTradeports returns all locations within a system that provides the ability to buy, or sell goods.
 * The Stanton system is used by default.
 */
export async function FetchUEXTradeports() {
    const fetchTradeports = await fetch(UEXAPIBASE + "tradeports/system/ST/", {
        method: "GET",
        headers: {
            api_key: process.env.UEX,
        },
    });
    if (!fetchTradeports.ok)
        throw new Error(
            "Request failed with status: " +
                fetchTradeports.status +
                ", " +
                fetchTradeports.statusText +
                "."
        );
    const body: Tradeport[] = (await fetchTradeports.json()).data;
    body.forEach((tradeport: Tradeport, i: number) => {
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
            body[i].space = Boolean(Number(tradeport.space));
            body[i].visible = Boolean(Number(tradeport.visible));
            body[i].armistice = Boolean(Number(tradeport.armistice));
            body[i].trade = Boolean(Number(tradeport.trade));
            body[i].outlaw = Boolean(Number(tradeport.outlaw));
            body[i].refinery = Boolean(Number(tradeport.refinery));
            body[i].shops = Boolean(Number(tradeport.shops));
            body[i].restricted = Boolean(Number(tradeport.restricted));
            body[i].prices = pricesNew;
        }
    });
    UEXTradePorts = body;
}

/**
 * FetchPlanets returns an array of all planets within a system.
 * The Stanton system is used by default.
 */
export async function FetchPlanets() {
    const fetchPlanets = await fetch(UEXAPIBASE + "planets/system/ST", {
        method: "GET",
        headers: {
            api_key: process.env.UEX,
        },
    });

    Planets = (await fetchPlanets.json()).data;
}

/**
 * FetchSatellites returns an array of all planetary satellites within a system.
 * The Stanton system is used by default.
 */
export async function FetchSatellites() {
    const FetchSatellites = await fetch(UEXAPIBASE + "satellites/system/ST", {
        method: "GET",
        headers: {
            api_key: process.env.UEX,
        },
    });

    Satellites = (await FetchSatellites.json()).data;
}
