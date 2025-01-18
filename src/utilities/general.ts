import { AttachmentBuilder } from "discord.js";

export const time_week_seconds = 7 * 24 * 3600;

export function msToTime(duration: number) {
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));

    return `${hours !== 0 ? `${hours < 10 ? `0${hours}` : hours}${hours === 1 ? "hr" : "hrs"}` : ""} ${
        minutes !== 0 ? `${minutes < 10 ? `0${minutes}` : minutes}${minutes === 1 ? "min" : "mins"}` : ""
    } ${seconds !== 0 ? `${seconds < 10 ? `0${seconds}` : seconds}s` : ""} ${
        milliseconds !== 0 ? `${milliseconds}ms` : ""
    }`.trim();
}

export const blue = 0x0251a8,
    red = 0xff0000,
    dev = 0xffff61,
    prod = 0x6e61ff;

/**
 * For ensuring that what I'm requesting is, infact, defined.
 * https://stackoverflow.com/questions/54738221/typescript-array-find-possibly-undefined
 * @param argument
 * @param message
 * @returns
 */
export function ensure<T>(argument: T | undefined | null, message = "This value was promised to be there."): T {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }

    return argument;
}

export function interactionType(type: number): string {
    let newType = "unknown";
    switch (type) {
        case 1:
            newType = "ping";
            break;
        case 2:
            newType = "application";
            break;
        case 3:
            newType = "message component";
            break;
        case 4:
            newType = "autocomplete";
            break;
        case 5:
            newType = "modal submit";
            break;
    }
    return newType;
}

export function getBrandImage(name: string): {
    file: AttachmentBuilder;
    name: string;
} | null {
    switch (name) {
        case "Origin Jumpworks": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/ORIGIN_JUMPWORKS_WHITE.png"),
                name: "ORIGIN_JUMPWORKS_WHITE.png",
            };
        }
        case "Aegis Dynamics": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/AEGIS_DYNAMICS_WHITE.png"),
                name: "AEGIS_DYNAMICS_WHITE.png",
            };
        }
        case "Anvil Aerospace": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/ANVIL_AEROSPACE_WHITE.png"),
                name: "ANVIL_AEROSPACE_WHITE.png",
            };
        }
        case "Aopoa": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/AOPOA_WHITE.png"),
                name: "AOPOA_WHITE.png",
            };
        }
        case "Argo Astronautics": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/AROG_ASTRONAUTICS_WHITE.png"),
                name: "AROG_ASTRONAUTICS_WHITE.png",
            };
        }
        case "Banu": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/BANU_WHITE.png"),
                name: "BANU_WHITE.png",
            };
        }
        case "Consolidated Outland": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/CONSOLIDATED_OUTLAND_WHITE.png"),
                name: "CONSOLIDATED_OUTLAND_WHITE.png",
            };
        }
        case "Crusader Industries": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/CRUSADER_INDUSTRIES_WHITE.png"),
                name: "CRUSADER_INDUSTRIES_WHITE.png",
            };
        }
        case "Drake Interplantery": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/DRAKE_INTERPLANETARY_WHITE.png"),
                name: "DRAKE_INTERPLANETARY_WHITE.png",
            };
        }
        case "Esperia": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/ESPERIA_WHITE.png"),
                name: "ESPERIA_WHITE.png",
            };
        }
        case "Kruger Intergalactic": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/KRUGER_INTERGALACTIC_WHITE.png"),
                name: "KRUGER_INTERGALACTIC_WHITE.png",
            };
        }
        case "Musashi Industrial & Starflight Concern": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/MISC_WHITE.png"),
                name: "MISC_WHITE.png",
            };
        }
        case "Roberts Space Industries": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/RSI_WHITE.png"),
                name: "RSI_WHITE.png",
            };
        }
        case "Tumbril Land Systems": {
            return {
                file: new AttachmentBuilder("./src/assets/brands/TUMBRIL_WHITE.png"),
                name: "TUMBRIL_WHITE.png",
            };
        }
        default: {
            return null;
        }
    }
}
