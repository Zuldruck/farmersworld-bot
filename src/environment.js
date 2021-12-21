import dotenv from 'dotenv';

dotenv.config();

export const REPAIR_IF_DURABILITY_LOWER = process.env.REPAIR_IF_DURABILITY_LOWER;
export const RECOVER_IF_ENERGY_LOWER = process.env.RECOVER_IF_ENERGY_LOWER;
export const LOWEST_ENERGY = process.env.LOWEST_ENERGY;
export const MINIMUM_FEE = process.env.MINIMUM_FEE;
export const MINIMUN_WITHDRAW = process.env.MINIMUN_WITHDRAW;
export const WITHDRAWABLE = process.env.WITHDRAWABLE.split(',');
export const PAYBW = process.env.PAYBW;

export const WALLET = process.env.WALLET;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
