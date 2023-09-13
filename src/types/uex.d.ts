export interface UEXShip {
    manufacturer: string;
    name: string;
    serie: string;
    code: string;
    loaner: string | null;
    role: string;
    scu: number;
    crew: string;
    implemented: string;
    mining: string;
    stealth: string;
    price: number;
    price_warbond: number | null;
    price_pkg: number;
    photos: string;
    store_url: string;
    stock_qt_speed: number;
    flyable_since: string;
    showdown_winner: number;
    date_added: number;
    date_modified: number;
    buy_at:
        | {
              system: string;
              system_name: string;
              planet: string;
              planet_name: string;
              satellite: string | null;
              satellite_name: string | null;
              city: string;
              city_name: string;
              tradeport: string | null;
              tradeport_name: string | null;
              store: string;
              store_name: string;
              price: number;
              date_added: number;
              date_modified: number;
          }[]
        | null;
    rent_at:
        | {
              system: string;
              system_name: string;
              planet: string;
              planet_name: string;
              satellite: null;
              satellite_name: null;
              city: string;
              city_name: string;
              tradeport: string | null;
              tradeport_name: string | null;
              store: string;
              store_name: string;
              price: number;
              date_added: number;
              date_modified: number;
          }[]
        | null;
}

export interface Systems {
    name: string;
    code: string;
    available: number;
    default: number;
    date_added: number;
    date_modified: number;
}

export interface Tradeport {
    system: string;
    planet: string;
    satellite: string | null;
    city: string | null;
    code: string;
    name: string;
    name_short: string;
    space: boolean;
    visible: boolean;
    armistice: boolean;
    trade: boolean;
    outlaw: boolean;
    refinery: boolean;
    shops: boolean;
    restricted: boolean;
    minable: number;
    date_added: number;
    date_modified: number;
    prices?: tradeportPrices[];
}

export interface TradeportPrices {
    name: string;
    kind: string;
    code: string;
    operation: string;
    price_buy: number;
    price_sell: number;
    date_update: number;
    is_updated: boolean;
}

export interface Planet {
    system: string;
    code: string;
    name: string;
    available: number;
    date_added: number;
    date_modified: number;
}
