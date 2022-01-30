import dotenv from 'dotenv';

dotenv.config();

export const REPAIR_IF_DURABILITY_LOWER = parseInt(process.env.REPAIR_IF_DURABILITY_LOWER);
export const RECOVER_IF_ENERGY_LOWER = parseInt(process.env.RECOVER_IF_ENERGY_LOWER);
export const LOWEST_ENERGY = parseInt(process.env.LOWEST_ENERGY);
export const MINIMUM_FEE = parseInt(process.env.MINIMUM_FEE);
export const MINIMUM_WITHDRAW = parseInt(process.env.MINIMUM_WITHDRAW);
export const WITHDRAWABLE = process.env.WITHDRAWABLE && process.env.WITHDRAWABLE.split(',');
export const PAYBW = process.env.PAYBW;

export const WALLET = process.env.WALLET;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const PORT = parseInt(process.env.PORT);
