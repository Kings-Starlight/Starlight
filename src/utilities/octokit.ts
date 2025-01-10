import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { log } from "../logging/logger";

// biome-ignore lint/suspicious/noExplicitAny: havent yet obtained its full type...
export let Github: any;

export async function initiateGithub() {
    log.info("setting up Octokit");
    Github = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: process.env.GH_APPID,
            privateKey: process.env.GH_AUTH,
            installationId: process.env.GH_INSTALLID,
        },
    });
    await Github.rest.apps.getAuthenticated();

    log.info("Octokit is active and authenticated.");
}
