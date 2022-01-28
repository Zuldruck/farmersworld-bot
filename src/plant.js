import { cropclaim, queryData, recover, tables } from "./farmersworld.js";
import { delay, calcNextClaim, getClaimableAssets, parseBalance, toCamelCase } from "./utils.js";
import { createRequire } from "module";
import { PAYBW, WALLET, PRIVATE_KEY } from "./environment.js";
const require = createRequire(import.meta.url);
const ENERGY_PER_FOOD = 5;
const PLANT_CHARGE_TIME = 14400; // 4 hours

let cropconf;

async function water(plant, paybw = null) {
    console.log("Watering", plant.assetId);
    await cropclaim(plant, paybw);
}

async function getPlantConf() {
    const data = await queryData("cropconf", null, 1);
    return (
        data.rows
            .map((r) => toCamelCase(r))
            // map table
            .reduce((a, c) => {
                a[c.templateId] = c;
                return a;
            }, {})
    );
}

async function recoverEnergy(plants, paybw = null) {
    if (plants.length === 0) return;
    const data = await queryData("accounts", WALLET, 1);
    if (!data || data.rows.length === 0) return;
    const account = toCamelCase(data.rows[0]);
    const actualFood = parseBalance(
        account.balances.find((r) => r.toUpperCase().endsWith("FOOD"))
    );

    const consumedEnergy = plants
        .reduce((a, c) => a + cropconf[c.templateId].energyConsumed, 0);

    console.log(`Claiming crops consume ${consumedEnergy} energy`);

    if (account.energy >= consumedEnergy) return;
    
    const foodNeededToRecover = Math.floor(
        (account.maxEnergy - account.energy) / ENERGY_PER_FOOD
    );
    const energyToRecover = (foodNeededToRecover < actualFood
        ? foodNeededToRecover
        : Math.floor(actualFood)) * ENERGY_PER_FOOD;

    console.log(`Recovering ${energyToRecover} energy`);
    await recover(
        { wallet: WALLET, privateKey: PRIVATE_KEY },
        energyToRecover,
        paybw
    );
}

async function main(paybw = null) {
    const plants = await tables("crops", { wallet: WALLET, privateKey: PRIVATE_KEY });
    const nextClaim = calcNextClaim(plants, PLANT_CHARGE_TIME);
    const difftime = Math.ceil(nextClaim - Date.now() / 1000);

    if (difftime > 0) {
        console.log(
            "Next cropclaim at",
            new Date(nextClaim * 1000).toLocaleString("en-US", {
                timeZoneName: "short",
                timeZone: "Europe/Paris",
            })
        );

        await delay(difftime * 1000);
    }

    const claimable = getClaimableAssets(plants);

    await recoverEnergy(claimable, paybw);
    await delay(400);

    for (const plant of claimable) {
        await water(plant, paybw);
        await delay(400);
    }
}

export default async function () {
    let paybw = null;
    if (PAYBW) {
        paybw = require("./paybw.json");
    }

    // load cropconf
    cropconf = await getPlantConf();

    while (true) {
        try {
            await main(paybw);
        } catch (e) {
            // an error occus
            console.log("[Error] -", e);
        }
    }
}
