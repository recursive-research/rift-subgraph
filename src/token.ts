import { 
	Address,
} from "@graphprotocol/graph-ts"

import {
	Token as TokenContract
} from "../generated/templates/Token/Token"

import {
	Token as TokenInstance,
} from "../generated/schema"

import {
	Token as TokenTemplate,
} from "../generated/templates"

export function getOrCreateTokenInstance(addr:Address):TokenInstance {
	let id = addr.toHex()
	let token = TokenInstance.load(id);

	if (token!=null) return token;

	let tokenContract = TokenContract.bind(addr);

	TokenTemplate.create(addr);

	token = TokenInstance.load(id);

	if (token == null) token = new TokenInstance(id);

	token.name = tokenContract.name();
	token.symbol = tokenContract.symbol();
	token.decimals = tokenContract.decimals();

	token.save();
	return token;
}
