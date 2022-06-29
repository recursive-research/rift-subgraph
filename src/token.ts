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

export function getOrCreateTokenInstance(id:Address):TokenInstance {
	let token = TokenInstance.load(id.toHex());

	if (token!=null) return token;

	let tokenContract = TokenContract.bind(id);

	TokenTemplate.create(id);

	token = TokenInstance.load(id.toHex());

	if (token == null) token = new TokenInstance(id.toHex());

	token.name = tokenContract.name();
	token.symbol = tokenContract.symbol();
	token.decimals = tokenContract.decimals();

	token.save();
	return token;
}
