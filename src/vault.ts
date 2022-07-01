import { Address } from "@graphprotocol/graph-ts";

import { Vault as VaultTemplate } from "../generated/templates";
import { Vault as VaultInstance } from "../generated/schema";
import { MasterChefVault as VaultContract } from "../generated/templates/Vault/MasterChefVault";

import { getOrCreateToken } from "./token";
import { addressToId, idToAddress } from "./utils";
import { getOrCreatePair } from "./pair";

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
function vaultType(addr: Address): string {
  const contract = VaultContract.bind(Address.fromBytes(addr));
  const rewarder = contract.try_rewarder();

  return rewarder.reverted ? VAULT_TYPE_UNI_V2 : VAULT_TYPE_SUSHI;
}

function initializeVault(addr: Address): VaultInstance {
  VaultTemplate.create(addr);
  const vaultContract = VaultContract.bind(addr);
  const id = addressToId(addr);
  let vault = VaultInstance.load(id);

  if (vault == null) vault = new VaultInstance(id);

  const token0 = getOrCreateToken(vaultContract.token0());
  const token1 = getOrCreateToken(vaultContract.token1());
  const pair = getOrCreatePair(vaultContract.pair());

  vault.type = vaultType(idToAddress(vault.id));
  vault.token0 = token0.id;
  vault.token1 = token1.id;
  vault.core = addressToId(vaultContract.core());
  vault.pair = pair.id;

  return vault;
}
