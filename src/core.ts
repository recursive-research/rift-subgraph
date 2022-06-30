import { Address } from "@graphprotocol/graph-ts";

import { Core as CoreInstance } from "../generated/schema";
import {
  VaultRegistered,
  VaultRegistered1 as VaultRegistered_old
} from "../generated//Core/Core";

import { getOrCreateVault } from "./vault";
import { addressToId } from "./utils";

export function getOrCreateCore(addr: Address): CoreInstance {
  let core = CoreInstance.load(addressToId(addr));

  if (core != null) return core;

  core = initializeCore(addr);
  core.save();

  return core;
}

function initializeCore(addr: Address): CoreInstance {
  return new CoreInstance(addressToId(addr));
}

export function handleVaultRegistered(event: VaultRegistered): void {
  handleVaultRegisteredBase(event.address, event.params.vault);
}

export function handleVaultRegistered_old(event: VaultRegistered_old): void {
  handleVaultRegisteredBase(event.address, event.params.vault);
}

function handleVaultRegisteredBase(addr: Address, vaultAddr: Address): void {
  let core = getOrCreateCore(addr);
  core.save();

  let vault = getOrCreateVault(vaultAddr);
  vault.save();
}
