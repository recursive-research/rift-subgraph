import { Address } from "@graphprotocol/graph-ts";

import { Vault as VaultTemplate } from "../generated/templates";
import { Vault as VaultInstance } from "../generated/schema";
import { MasterChefVault as VaultContract } from "../generated/templates/Vault/MasterChefVault";

import { getOrCreateToken } from "./token";
import { addressToId } from "./utils";

export const VAULT_TYPE_SUSHI = "SUSHI_SWAP";
export const VAULT_TYPE_UNI_V2 = "UNISWAP_V2";

export function getOrCreateVault(addr: Address): VaultInstance {
  let vault = VaultInstance.load(addressToId(addr));

  if (vault != null) return vault;

  vault = initializeVault(addr);
  vault.save();

  return vault;
}

// tries to read a state variable specific to MasterChefV2 from a contract at address addr, and if it doesn't respond - assumes it is uniswap
export function vaultType(addr: Address): string {
  let contract = VaultContract.bind(Address.fromBytes(addr));
  let rewarder = contract.try_rewarder();

  return rewarder.reverted ? VAULT_TYPE_UNI_V2 : VAULT_TYPE_SUSHI;
}

function initializeVault(addr: Address): VaultInstance {
  VaultTemplate.create(addr);
  let vaultContract = VaultContract.bind(addr);
  const id = addressToId(addr);
  let vault = VaultInstance.load(id);

  if (vault == null) vault = new VaultInstance(id);

  let token0 = getOrCreateToken(vaultContract.token0());
  let token1 = getOrCreateToken(vaultContract.token1());

  vault.type = vaultType(Address.fromString(vault.id));
  vault.token0 = token0.id;
  vault.token1 = token1.id;
  vault.core = addressToId(vaultContract.core());

  return vault;
}
