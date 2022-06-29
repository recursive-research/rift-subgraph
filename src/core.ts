import {
	getOrCreateVault,
	getOrCreateCoreInstance,
} from './utils';

import {
	VaultRegistered,
} from "../generated/Core/Core";

export function handleVaultRegistered(event:VaultRegistered):void {
	let addr = event.transaction.to;
	if (!addr) return;

	let core =  getOrCreateCoreInstance(addr);
	core.save();

	let vault = getOrCreateVault(event.params.vault);
	vault.save();
}
