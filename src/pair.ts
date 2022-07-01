import { Address } from "@graphprotocol/graph-ts";

import { Pair as PairInstance } from "../generated/schema";
import { addressToId } from "./utils";

export function getOrCreatePair(addr: Address): PairInstance {
  let pair = PairInstance.load(addressToId(addr));

  if (pair != null) return pair;

  pair = initializePair(addr);
  pair.save();

  return pair;
}

function initializePair(addr: Address): PairInstance {
  return new PairInstance(addressToId(addr));
}
