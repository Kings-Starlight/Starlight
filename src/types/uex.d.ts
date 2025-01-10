export interface UEXShip {
    id: number;
    id_company: number; // vehicle manufacturer
    id_parent: number; // parent ship series
    ids_vehicles_loaners: string; // vehicles loaned, comma separated
    name: string;
    name_full: string;
    scu: number;
    crew: string;
    is_addon: number; // e.g. RSI Galaxy Refinery Module
    is_concept: number;
    is_civilian: number;
    is_military: number;
    is_exploration: number;
    is_passenger: number;
    is_industrial: number;
    is_mining: number;
    is_salvage: number;
    is_refinery: number;
    is_scanning: number;
    is_cargo: number;
    is_medical: number;
    is_racing: number;
    is_repair: number;
    is_refuel: number;
    is_interdiction: number;
    is_bomber: number;
    is_tractor_beam: number;
    is_qed: number;
    is_emp: number;
    is_construction: number;
    is_datarunner: number;
    is_science: number;
    is_boarding: number;
    is_stealth: number;
    is_research: number;
    is_carrier: number;
    is_ground_vehicle: number;
    is_spaceship: number;
    is_showdown_winner: number;
    url_store: string;
    url_brochure: string;
    url_hotsite: string;
    url_video: string;
    url_photos: string[]; // array of urls
    game_version: string; // version it was announced or updated
    date_added: number; // timestamp
    date_modified: number; // timestamp
    company_name: string; // manufacturer name
}
