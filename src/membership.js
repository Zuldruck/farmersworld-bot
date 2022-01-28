import { PAYBW } from "./environment";
import { tables } from "./farmersworld";
import { calcNextClaim, delay, getClaimableAssets } from "./utils";

const ENERGY_CONSUMED = 100;
const CHARGE_TIME = 86400; // 24 hours

async function recoverEnergy(memberships, paybw = null)
{
  if (memberships.length === 0) return;
  const wallets = new Set(memberships.map((r) => r.owner));
}

async function main(paybw = null)
{
  const memberships = await tables("mbs", { wallet: WALLET, privateKey: PRIVATE_KEY });
  const nextClaim = calcNextClaim(memberships, CHARGE_TIME);
  const difftime = Math.ceil(nextClaim - Date.now() / 1000);

  if (difftime > 0) {
    console.log(
      "Next memebrship claim at",
      new Date(nextClaim * 1000).toLocaleString("en-US", {
          timeZoneName: "short",
          timeZone: "Europe/Paris",
      })
    );
    await delay(difftime * 1000);
  }

  const claimableMemberships = getClaimableAssets(memberships);

  await recoverEnergy(claimableMemberships, paybw);
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


