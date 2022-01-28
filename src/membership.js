import { PAYBW, WALLET, PRIVATE_KEY } from "./environment.js";
import { mbsclaim, queryData, recover, tables } from "./farmersworld.js";
import { calcNextClaim, delay, getClaimableAssets, parseBalance, toCamelCase } from "./utils.js";

const ENERGY_PER_FOOD = 5;
const ENERGY_CONSUMED = 100;
const CHARGE_TIME = 86400; // 24 hours

async function claim(membership, paybw = null)
{
  console.log("Claiming", membership.assetId);
  await mbsclaim(membership, paybw);
}

async function recoverEnergy(memberships, paybw = null)
{
  if (memberships.length === 0) return;

  const data = await queryData("accounts", WALLET, 1);
  if (!data || data.rows.length === 0) return;
  const account = toCamelCase(data.rows[0]);
  const actualFood = parseBalance(
    account.balances.find((r) => r.toUpperCase().endsWith("FOOD"))
  );

  const energyNeeded = memberships.length * ENERGY_CONSUMED;

  console.log(`Claiming memberships consume ${energyNeeded} energy`);

  if (account.energy >= energyNeeded) return;

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
    paybw,
  );
}

async function main(paybw = null)
{
  const memberships = await tables("mbs", { wallet: WALLET, privateKey: PRIVATE_KEY });
  const nextClaim = calcNextClaim(memberships, CHARGE_TIME);
  const difftime = Math.ceil(nextClaim - Date.now() / 1000);

  if (difftime > 0) {
    console.log(
      "Next membership claim at",
      new Date(nextClaim * 1000).toLocaleString("en-US", {
          timeZoneName: "short",
          timeZone: "Europe/Paris",
      })
    );
    await delay(difftime * 1000);
  }

  const claimableMemberships = getClaimableAssets(memberships);

  await recoverEnergy(claimableMemberships, paybw);
  await delay(400);

  for (const membership of claimableMemberships) {
    await claim(membership, paybw);
    await delay(1000);
  }
}

export default async function membership()
{
  const paybw = PAYBW ? require("./paybw.json") : null;

  while (true) {
    try {
      await main(paybw);
    } catch (e) {
      console.log("[Error] -", e);
    }
  }
}
