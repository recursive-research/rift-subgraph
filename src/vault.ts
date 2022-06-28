import {
	getAssetCode,
	getOrCreateVault,
	getVaultBalance,
} from "./utils"


import { 
	Address,
} from "@graphprotocol/graph-ts"

import {
	AssetsClaimed,
	DepositScheduled,
	EpochDurationUpdated,
	FundsRescued,
	NextEpochStarted,
	Paused,
	Token0FloorUpdated,
	Token1FloorUpdated,
	Unpaused,
	Vault as VaultContract,
	WithdrawScheduled,
} from "../generated/templates/Vault/Vault"

import {
	Vault as VaultInstance,
} from "../generated/schema"

export function handleAssetsClaimed(event: AssetsClaimed): void {
	let vaultAddr = event.transaction.to;
	if (!vaultAddr) return;

	let vault = getOrCreateVault(vaultAddr);
	//updateTokenClaimState(vault, event);
	updateVaultBalances(vault);
	vault.save();
}

export function handleEpochDurationUpdated(event: EpochDurationUpdated): void {
	let vaultAddr = event.transaction.to;
	if (!vaultAddr) return;
	let vault = getOrCreateVault(vaultAddr);
	vault.epochDuration = event.params.newEpochDuration;
	vault.save();
}

export function handleFundsRescued(event: FundsRescued): void {
	let vaultAddr = event.transaction.to;
	if (!vaultAddr) return;

	let vault = getOrCreateVault(vaultAddr);
	updateVaultBalances(vault);
	vault.save();
}

export function handleNextEpochStarted(event: NextEpochStarted): void {
	let vaultAddr = event.transaction.to;
	if (!vaultAddr) return;

	let vault = getOrCreateVault(vaultAddr);
	updateVaultBalances(vault);
	vault.save();
}

export function handleDepositScheduled(event: DepositScheduled): void {
	/*
	// not implemented yet in schema
	let vaultAddr = event.transaction.to;
	if (!vaultAddr) return;
	let vault = getOrCreateVault(vaultAddr);
	if (!vault) return;
	updateTokenDepositRequestState(vault, event);
	*/
}

export function handlePaused(event: Paused): void {
	let vaultAddr = event.transaction.to;
	if (!vaultAddr) return;
	let vault = getOrCreateVault(vaultAddr);
	vault.paused = true;
	vault.save();
}

export function handleUnpaused(event: Unpaused): void {
	let vaultAddr = event.transaction.to;
	if (!vaultAddr) return;
	let vault = getOrCreateVault(vaultAddr);
	vault.paused = false;
	vault.save();
}

export function handleWithdrawScheduled(event: WithdrawScheduled): void {
	let to = event.transaction.to;
	if (!to) return;
	let vault = getOrCreateVault(to);
	vault.save();
}

export function handleToken0FloorUpdated(event: Token0FloorUpdated): void {}

export function handleToken1FloorUpdated(event: Token1FloorUpdated): void {}

function updateTokenDepositRequestState(vault:VaultInstance, event:DepositScheduled): void {
    let accessor = `${getAssetCode(event.params.assetCode)}DepositRequestsTotal`;
    vault.setBigInt(
        accessor,
        vault.getBigInt(accessor) + event.params.amount
    );
}


function updateTokenClaimState(vault: VaultInstance, event: AssetsClaimed):void {
	let accessor = `${getAssetCode(event.params.assetCode)}ClaimableTotal`;
	vault.setBigInt(
		accessor,
		vault.getBigInt(accessor) - event.params.amount
	);
}

/**
 * This function is used on each state update event to call the underlying vault contract to get / update the ...
 * balances of token0 and token1. Since this requires ETH calls, we want to eventually remove this from all its ...
 * callsites.
 */
function updateVaultBalances(vault:VaultInstance):void {
	vault.token0Balance = getVaultBalance(Address.fromBytes(vault.address), Address.fromString(vault.token0));
	vault.token1Balance = getVaultBalance(Address.fromBytes(vault.address), Address.fromString(vault.token1));
}

