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

// https://github.com/ethers-io/ethers.js/blob/608864fc3f00390e1260048a157af00378a98e41/packages/address/src.ts/index.ts#L12
function getChecksumAddress(addr: Address): string {
  let addrStr = addr.toHex();
  const chars = addrStr.substring(2).split("");

  const expanded = new Uint8Array(40);
  for (let i = 0; i < 40; i++) {
    expanded[i] = chars[i].charCodeAt(0);
  }

  const hashed = crypto.keccak256(addr);

  for (let i = 0; i < 40; i += 2) {
    if (hashed[i >> 1] >> 4 >= 8) {
      chars[i] = chars[i].toUpperCase();
    }
    if ((hashed[i >> 1] & 0x0f) >= 8) {
      chars[i + 1] = chars[i + 1].toUpperCase();
    }
  }

  return "0x" + chars.join("");
}
