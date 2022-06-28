import { 
    Address,
    BigInt,
    ByteArray,
    crypto,
} from "@graphprotocol/graph-ts";

import {
    Vault as VaultInstance,
} from '../generated/schema';

import {
    Core as CoreInstance,
} from "../generated/schema"

import {
    Token as TokenContract
} from "../generated/templates/Token/Token"

import {
    Vault as VaultContract,
} from '../generated/templates/Vault/Vault';

import {
    Core as CoreContract,
} from "../generated/Core/Core";

import {
    Vault as VaultTemplate,
} from '../generated/templates'

import { getOrCreateTokenInstance } from "./token";

import { MasterChefV2Vault } from "../generated/templates/Vault/MasterChefV2Vault"

const TOKEN0_KECCAK = crypto.keccak256(ByteArray.fromUTF8("TOKEN0"));
const TOKEN1_KECCAK = crypto.keccak256(ByteArray.fromUTF8("TOKEN1")); // unused, but included for completeness

// no string enums https://github.com/AssemblyScript/assemblyscript/issues/560
const TOKEN_0 = 'token0';
const TOKEN_1 = 'token1';

const VAULT_TYPE_SUSHI = "SUSHI"
const VAULT_TYPE_UNI = "UNI"


// The address of the core pseudo-factory contract
var coreAddr:Address;

export function getAssetCode(assetCode:ByteArray): string {
    return assetCode == TOKEN0_KECCAK ? TOKEN_0 : TOKEN_1;
}

export function getOrCreateVault(addr:Address):VaultInstance {
    let vault = VaultInstance.load(addr.toHex());
    if (vault != null) {
        return vault;
    }
    return initializeVault(addr);
}

function initializeVault(addr:Address):VaultInstance{
    VaultTemplate.create(addr);
    let vaultContract = VaultContract.bind(addr);
    
    let vault = VaultInstance.load(addr.toHex());
    if (vault == null) vault = new VaultInstance(addr.toHex());

    let token0Address = vaultContract.token0();
    let token1Address = vaultContract.token1();

    let token0 = getOrCreateTokenInstance(token0Address);
    let token1 = getOrCreateTokenInstance(token1Address);

    // initialize vault parameters
    vault.address = addr;
    vault.core = coreAddress().toHex();
    vault.epochDuration = vaultContract.epochDuration();
    vault.paused = vaultContract.paused();
    vault.token0 = token0.id;
    vault.token1 = token1.id;
    vault.vaultType = vaultType(addr)
    vault.token0Balance = getVaultBalance(addr, token0Address);
    vault.token1Balance = getVaultBalance(addr, token1Address);

    return vault;
}

// triews to get an instance of core. If it fails, it creates one
export function getOrCreateCoreInstance(id: Address):CoreInstance {
    coreAddr = id;
    let idStr = id.toHex();
    let core = CoreInstance.load(idStr);

    if (core != null) return core;

    let coreContract = CoreContract.bind(id);

    core = new CoreInstance(idStr);
    core.address = id;
    core.maxFee = coreContract.MAX_FEE();
    core.paused = coreContract.paused();
  
    return core
}

export function getVaultBalance(vaultAddr:Address, tokenAddr:Address):BigInt {
    let tokenContract = TokenContract.bind(tokenAddr);
    return tokenContract.balanceOf(vaultAddr);
}


// using this getter which refers to coreAddr, which is set whenever we query
// a core instance, since we only expect one core instance. This is to avoid
// hardcoding per-chain
export function coreAddress():Address{
    return coreAddr;
}

// tries to read a state variable specific to MasterChefV2 from a contract at address addr, and if it doesn't respond - assumes it is uniswap
function vaultType(addr:Address):string {
	let contract = MasterChefV2Vault.bind(Address.fromBytes(addr));
	let rewarder = contract.try_rewarder()

	return rewarder.reverted ? VAULT_TYPE_UNI : VAULT_TYPE_SUSHI
}