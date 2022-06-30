import { Address } from '@graphprotocol/graph-ts';

import { Core as CoreInstance } from '../generated/schema';

import { VaultRegistered } from '../generated/Core/Core';

import { getOrCreateVault } from './vault';

import { addressToId } from './utils';

// The address of the core pseudo-factory contract
var coreAddr:Address;

// using this getter which refers to coreAddr, which is set whenever we query
// a core instance, since we only expect one core instance. This is to avoid
// hardcoding per-chain
export function coreAddress():Address{
    return coreAddr;
}

// tries to get an instance of core. If it fails, it creates one
export function getOrCreateCore(addr: Address):CoreInstance {
    coreAddr = addr;
    let core = CoreInstance.load(addressToId(addr));

    if (core != null) return core;

    core = initializeCore(addr);
	core.save();

	return core;
}

function initializeCore(addr:Address):CoreInstance {
	return new CoreInstance(addressToId(addr));
}

export function handleVaultRegistered(event:VaultRegistered):void {
	let core =  getOrCreateCore(event.address);
	core.save();

	let vault = getOrCreateVault(event.params.vault);
	vault.save();
}
