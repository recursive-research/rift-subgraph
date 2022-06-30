import { Address, BigInt, ByteArray, crypto } from "@graphprotocol/graph-ts";

import { Token as TokenContract } from "../generated/templates/Token/Token";

const TOKEN0_KECCAK = crypto.keccak256(ByteArray.fromUTF8("TOKEN0"));
const TOKEN1_KECCAK = crypto.keccak256(ByteArray.fromUTF8("TOKEN1")); // unused, but included for completeness

// no string enums https://github.com/AssemblyScript/assemblyscript/issues/560
const TOKEN_0 = "token0";
const TOKEN_1 = "token1";

export function getAssetCode(assetCode: ByteArray): string {
  return assetCode == TOKEN0_KECCAK ? TOKEN_0 : TOKEN_1;
}

export function getVaultBalance(
  vaultAddr: Address,
  tokenAddr: Address
): BigInt {
  let tokenContract = TokenContract.bind(tokenAddr);
  return tokenContract.balanceOf(vaultAddr);
}

export function addressToId(addr: Address): string {
  return addr.toHex();
}

export function idToAddress(id: string): Address {
  return Address.fromString(id.toLowerCase());
}
