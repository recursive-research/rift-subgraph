import { Address } from '@graphprotocol/graph-ts'

import { Token as TokenContract } from '../generated/templates/Token/Token'

import { Token as TokenInstance } from '../generated/schema'

import { Token as TokenTemplate } from '../generated/templates'

import {
	addressToId,
} from './utils';

export function getOrCreateToken(addr:Address):TokenInstance {
	let token = TokenInstance.load(addressToId(addr));

	if (token!=null) return token;

	token = initializeToken(addr);
	token.save();

	return token;
}

function initializeToken(addr:Address):TokenInstance {
	let tokenContract = TokenContract.bind(addr);
	
	TokenTemplate.create(addr);

	const id = addressToId(addr);
	let token = TokenInstance.load(id);

	if (token == null) token = new TokenInstance(id);

	token.name = tokenContract.name();
	token.symbol = tokenContract.symbol();
	token.decimals = tokenContract.decimals();

	return token;
}
