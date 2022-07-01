import { Address } from "@graphprotocol/graph-ts";

export function addressToId(addr: Address): string {
  return addr.toHex();
}

export function idToAddress(id: string): Address {
  return Address.fromString(id.toLowerCase());
}
