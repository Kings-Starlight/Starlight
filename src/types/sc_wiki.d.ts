export interface GalactapediaResult {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    template: string;
    rsi_url: string;
    api_url: string;
    created_at: string;
    categories: [
        {
            id: string;
            name: string;
        }
    ];
    tags: [
        {
            id: string;
            name: string;
        }
    ];
    properties: [
        {
            name: string;
            value: string;
        }
    ];
    related_articles: [
        {
            id: string;
            title: string;
            url: string;
            api_url: string;
        }
    ];
    translations: {
        en_EN: string;
        de_DE: string;
    };
}

export interface WikiShip {
    uuid: string;
    name: string;
    slug: string;
    class_name: string;
    sizes: {
        length: number;
        beam: number;
        height: number;
    };
    emission: {
        ir: number;
        em_idle: number;
        em_max: number;
    };
    mass: number;
    cargo_capacity: number;
    vehicle_inventory: number;
    personal_inventory: number;
    crew: {
        min: number;
        max: number | null;
        weapon: number;
        operation: null;
    };
    health: number;
    shield_hp: number;
    speed: {
        scm: number | null;
        max: number;
        zero_to_scm: number | null;
        zero_to_max: number;
        scm_to_zero: number | null;
        max_to_zero: number;
    };
    fuel: {
        capacity: number;
        intake_rate: number;
        usage: {
            main: number;
            maneuvering: number;
            retro: number;
            vtol: number;
        };
    };
    quantum?: {
        quantum_speed: number;
        quantum_spool_time: number;
        quantum_fuel_capacity: number;
        quantum_range: number;
    };
    agility: {
        pitch: number;
        yaw: number;
        roll: number;
        acceleration: {
            main: number;
            retro: number;
            vtol: number;
            maneuvering: number;
            main_g: number;
            retro_g: number;
            vtol_g: number;
            maneuvering_g: number;
        };
    };
    armor: {
        signal_infrared: number;
        signal_electromagnetic: number;
        signal_cross_section: number;
        damage_physical: number;
        damage_energy: number;
        damage_distortion: number;
        damage_thermal: number;
        damage_biochemical: number;
        damage_stun: number;
    };
    foci: { en_EN: string; de_DE: string }[];
    type: { en_EN: string; de_DE: string };
    description: { en_EN: string; de_DE: string };
    size_class: number;
    manufacturer: {
        name: string;
        code: string;
    };
    insurance: {
        claim_time: number;
        expedite_time: number;
        expedite_cost: number;
    };
    hardpoints: Hardpoint[];
    components: VehicleComponent[];
    shops: VehicleStore[];
    parts: ChildPart[];
    updated_at: string;
    version: string;
    id: number;
    chassis_id: number;
    production_status: { en_EN: string; de_DE: string };
    production_note: { en_EN: string; de_DE: string };
    size: { en_EN: string; de_DE: string };
    msrp: number;
    loaner:
        | {
              name: string;
              link: string;
              version: string;
          }[]
        | null;
}

interface VehicleComponent {
    type: string;
    name: string;
    mounts: number;
    component_size: number;
    category: string;
    size: number;
    details: string;
    quantity: number;
    manufacturer: string;
    component_class: string;
}

interface VehicleStore {
    uuid: number;
    name_raw: string;
    name: string;
    position: string;
    profit_margin: string;
    link: string;
    version: string;
    items: {
        uuid: string;
        name: string;
        type: string;
        sub_type: string;
        base_price: number;
        price_calculated: number;
        price_range: number;
        base_price_offset: number;
        max_discount: number;
        max_premium: number;
        inventory: number;
        optimal_inventory: number;
        max_inventory: number;
        auto_restock: boolean;
        auto_consume: boolean;
        refresh_rate: number;
        buyable: boolean;
        sellable: boolean;
        rentable: boolean;
        version: string;
        rental_price_days: {
            duration_1: number;
            duration_3: number;
            duration_7: number;
            duration_30: number;
        };
    }[];
}

interface ChildPart {
    name: string;
    display_name: string;
    damage_max: number;
    children: ChildPart[];
}

export interface Hardpoint {
    name: string;
    position: string;
    min_size: number;
    max_size: number;
    class_name: string;
    health: number;
    type: string;
    sub_type: number;
    children: Hardpoint[];
    item: MasterItem;
}

export interface Armor {
    signal_infrared: number;
    signal_electromagnetic: number;
    signal_cross_section: number;
    damage_physical: number;
    damage_energy: number;
    damage_distortion: number;
    damage_thermal: number;
    damage_biochemical: number;
    damage_stun: number;
}

export interface BarrelAttach {
    type: string;
}

export interface Clothing {
    armor_type: string;
    clothing_type: string;
    damage_reduction: number;
    temp_resistance_min: number;
    temp_resistance_max: number;
    resistances: Resistance[];
    base_model: string;
}

export interface Resistance {
    type: string;
    threshold: number;
    multiplier: number;
}

export interface Cooler {
    cooling_rate: number;
    suppression_ir_factor: number;
    suppression_heat_factor: number;
}

export interface DescriptionDatum {
    name: string;
    type: string;
}

export interface Dimension {
    width: number;
    height: number;
    length: number;
    volume: number;
    true_dimension: TrueDimension;
}

export interface TrueDimension {
    width: number;
    height: number;
    length: number;
}

export interface Distortion {
    decay_rate: number;
    decay_delay: number;
    maximum: number;
    overload_ratio: number;
    warning_ratio: number;
    recovery_ratio: number;
    recovery_time: number;
}

export interface Durability {
    health: number;
    max_lifetime: number;
    repairable: boolean;
    salvageable: boolean;
}

export interface Emp {
    charge_duration: number;
    emp_radius: number;
    unleash_duration: number;
    cooldown_duration: number;
}

export interface FlightController {
    scm_speed: number;
    max_speed: number;
    pitch: number;
    yaw: number;
    roll: number;
}

export interface Food {
    nutritional_density_rating: number;
    hydration_efficacy_index: number;
    container_type: string;
    one_shot_consume: boolean;
    can_be_reclosed: boolean;
    discard_when_consumed: boolean;
    effects: string[];
    updated_at: number;
    version: string;
}

export interface FuelIntake {
    fuel_push_rate: number;
    minimum_rate: number;
}

export interface FuelTank {
    fill_rate: number;
    drain_rate: number;
    capacity: number;
}

export interface Grenade {
    area_of_effect: string;
    damage_type: string;
    damage: number;
}

export interface Inventory {
    width: number;
    height: number;
    length: number;
    dimension: number;
    scu: number;
    scu_converted: number;
    unit: string;
}

export interface IronSight {
    magnification: string;
    optic_type: string;
}

export interface Manufacturer {
    name: string;
    code: string;
    link: string;
    ships_count: number;
    vehicles_count: number;
    items_count: number;
}

export interface MiningLaser {
    power_transfer: string;
    optimal_range: number;
    maximum_range: number;
    extraction_throughput: number;
    module_slots: number;
    modifiers: DescriptionDatum[];
    extraction_laser_power: string;
    mining_laser_power: string;
}

export interface MiningModule {
    type: string;
    uses: number;
    duration: string;
    modifiers: DescriptionDatum[];
}

export interface Missile {
    signal_type: string;
    lock_time: number;
    damage_total: number;
    damages: Damage[];
}

export interface Damage {
    type: string;
    name: string;
    damage: number;
}

export interface PersonalWeapon {
    class: string;
    magazine_type: string;
    magazine_size: string;
    effective_range: string;
    damage_per_shot: number;
    rof: string;
    modes?: PersonalWeaponMode[];
    damages: Damage[];
    size: number;
    lifetime: number;
    speed: number;
    range: number;
    base_model: string;
}

export interface PersonalWeaponMode {
    mode: string;
    type: string;
    rpm: number;
    ammo_per_shot: number;
    pellets_per_shot: number;
    damage_per_second: number;
}

export interface PersonalWeaponMagazine {
    initial_ammo_count: number;
    max_ammo_count: number;
    type: string;
}

export interface Ports {
    name: string;
    display_name: string;
    position: string;
    sizes: Sizes;
    tags: string[];
    required_tags: string[];
    equipped_item: MasterItem;
}

export interface Sizes {
    min: number;
    max: number;
}

export interface Power {
    power_base: number;
    power_draw: number;
    throttleable: boolean;
    overclockable: boolean;
    overclock_threshold_min: number;
    overclock_threshold_max: number;
    overclock_performance: number;
    overpower_performance: number;
    power_to_em: number;
    decay_rate_em: number;
    em_min: number;
    em_max: number;
}

export interface PowerPlant {
    power_output: number;
}

export interface QuantumDrive {
    quantum_fuel_requirement: number;
    jump_range: number;
    disconnect_range: number;
    thermal_energy_draw: ThermalEnergyDraw;
    modes: QuantumDriveMode[];
}

export interface QuantumDriveMode {
    type: string;
    drive_speed: number;
    cooldown_time: number;
    stage_one_accel_rate: number;
    stage_two_accel_rate: number;
    engage_speed: number;
    interdiction_effect_time: number;
    calibration_rate: number;
    min_calibration_requirement: number;
    max_calibration_requirement: number;
    calibration_process_angle_limit: number;
    calibration_warning_angle_limit: number;
    spool_up_time: number;
}

export interface ThermalEnergyDraw {
    pre_ramp_up: number;
    ramp_up: number;
    in_flight: number;
    ramp_down: number;
    post_ramp_down: number;
}

export interface QuantumInterdictionGenerator {
    jammer_range: number;
    interdiction_range: number;
    charge_duration: number;
    discharge_duration: number;
    cooldown_duration: number;
}

export interface SelfDestruct {
    damage: string;
    radius: number;
    min_radius: number;
    phys_radius: number;
    min_phys_radius: number;
    time: number;
}

export interface Shield {
    max_shield_health: number;
    max_shield_regen: number;
    decay_ratio: number;
    regen_delay: RegenDelay;
    max_reallocation: number;
    reallocation_rate: number;
}

export interface RegenDelay {
    damage: number;
    downed: number;
}

export interface Shops {
    uuid: number;
    name_raw: string;
    name: string;
    position: string;
    profit_margin: string;
    link: string;
    version: string;
    items: ItemElement[];
}

export interface ItemElement {
    uuid: string;
    name: string;
    type: string;
    sub_type: string;
    base_price: number;
    price_calculated: number;
    price_range: number;
    base_price_offset: number;
    max_discount: number;
    max_premium: number;
    inventory: number;
    optimal_inventory: number;
    max_inventory: number;
    auto_restock: boolean;
    auto_consume: boolean;
    refresh_rate: number;
    buyable: boolean;
    sellable: boolean;
    rentable: boolean;
    version: string;
    rental_price_days: RentalPriceDays;
}

export interface RentalPriceDays {
    duration_1: number;
    duration_3: number;
    duration_7: number;
    duration_30: number;
}

export interface Thruster {
    thrust_capacity: number;
    min_health_thrust_multiplier: number;
    fuel_burn_per_10k_newton: number;
    type: string;
}

export interface VehicleWeapon {
    class: string;
    type: string;
    capacity: number;
    range: string;
    damage_per_shot: number;
    modes: PersonalWeaponMode[];
    damages: Damage[];
    regeneration: Regeneration;
    ammunition: Ammunition;
    updated_at: string;
    version: string;
}

export interface Ammunition {
    size: number;
    lifetime: number;
    speed: number;
    range: number;
}

export interface Regeneration {
    requested_regen_per_sec: number;
    requested_ammo_load: number;
    cooldown: number;
    cost_per_bullet: number;
}

export interface SearchResponse {
    uuid: string;
    name: string;
    link: string;
    updated_at: string;
    version: string;
}

export interface ManufacturerShort {
    name: string;
    code: string;
    link: string;
    ships_count: number;
    vehicles_count: number;
    items_count: number;
}

export interface Manufacturer {
    name: string;
    code: string;
    uuid: string;
    ships: [
        {
            uuid: string;
            name: string;
            link: string;
            updated_at: string;
            version: string;
        }
    ];
    vehicles: [
        {
            uuid: string;
            name: string;
            link: string;
            updated_at: string;
            version: string;
        }
    ];
    items: [
        {
            uuid: string;
            name: string;
            type: string;
            sub_type: string;
            manufacturer: {
                name: string;
                code: string;
                link: string;
                ships_count: number;
                vehicles_count: number;
                items_count: number;
            };
            link: string;
            updated_at: string;
            version: string;
        }
    ];
}

export interface FPSItemShort {
    uuid: string;
    name: string;
    type: string;
    sub_type?: string;
    manufacturer: ManufacturerShort;
    link: string;
    updated_at: string;
    version: string;
}

export interface Weapon extends FPSItemShort {
    class: string;
}

export interface MasterItem {
    uuid?: string;
    name?: string;
    description?: { en_EN: string; de_DE: string };
    size?: number;
    grade?: string;
    class?: string;
    mass?: number;
    description_data?: DescriptionDatum[];
    manufacturer_description?: string;
    manufacturer?: Manufacturer;
    type?: string;
    sub_type?: string;
    min_size?: number;
    max_size?: number;
    max_mounts?: number;
    max_missiles?: number;
    max_bombs?: number;
    armor?: Armor;
    barrel_attach?: BarrelAttach;
    clothing?: Clothing;
    cooler?: Cooler;
    emp?: Emp;
    flight_controller?: FlightController;
    food?: Food;
    fuel_intake?: FuelIntake;
    fuel_tank?: FuelTank;
    grenade?: Grenade;
    iron_sight?: IronSight;
    mining_laser?: MiningLaser;
    mining_module?: MiningModule;
    missile?: Missile;
    personal_weapon?: PersonalWeapon;
    personal_weapon_magazine?: PersonalWeaponMagazine;
    power_plant?: PowerPlant;
    quantum_drive?: QuantumDrive;
    quantum_interdiction_generator?: QuantumInterdictionGenerator;
    self_destruct?: SelfDestruct;
    shield?: Shield;
    thruster?: Thruster;
    vehicle_weapon?: VehicleWeapon;
    dimension?: Dimension;
    inventory?: Inventory;
    tags?: string[];
    required_tags?: string[];
    interactions?: string[];
    ports?: Ports[];
    heat?: { [key: string]: number };
    power?: Power;
    distortion?: Distortion;
    durability?: Durability;
    shops?: Shops;
    updated_at?: number;
    version?: number;
    is_base_variant: boolean;
}

export interface WikiResponse {
    batchcomplete: boolean;
    query: {
        pages: {
            thumbnail: {
                source: string;
            };
            missing: boolean;
        }[];
    };
}
