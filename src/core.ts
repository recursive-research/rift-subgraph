import {
	getOrCreateVault,
	getOrCreateCoreInstance,
	coreAddress,
} from './utils';

import {
	FeeToUpdated,
	Paused,
	Unpaused,
	VaultRegistered,
	VaultRemoved,
	ProtocolFeeUpdated,
} from "../generated/Core/Core";

export function handleVaultRegistered(event:VaultRegistered):void {
	let addr = event.transaction.to;
	if (!addr) return;

	let core =  getOrCreateCoreInstance(addr);
	let vault = getOrCreateVault(event.params.vault);
	vault.save();
}

export function handlePaused(event: Paused): void {
	let coreAddr = event.transaction.to;
	if (!coreAddr) return;  
	let core = getOrCreateCoreInstance(coreAddr);
	if (!core) return;
	core.paused = true;
	core.save();
}

export function handleUnpaused(event: Unpaused): void {
	let coreAddr = event.transaction.to;
	if (!coreAddr) return;
	let core = getOrCreateCoreInstance(coreAddr);
	if (!core) return;
	core.paused = false;
	core.save();
}

//TODO: Implement
export function handleFeeToUpdated(event: FeeToUpdated): void {}
export function handleProtocolFeeUpdated(event: ProtocolFeeUpdated): void {}
export function handleVaultRemoved(event: VaultRemoved): void {}


