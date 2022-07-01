# Rift Subgraph

## Quickstart

TODO: put full instructions here

### Deployment

To deploy a new build of a subgraph:

- `graph auth --product hosted-service <deploy-key-for-subgraph>`
- `yarn codegen --network <network>`
- `yarn build --network <network>`
- for arbitrary subgraph `graph deploy --product hosted-service --network <network> <username>/<subgraph-name-for-network>`
- for mainnet: `yarn deploy`
- for aurora: `yarn deploy-aurora`

### Publish

To make a subgraph visible on the subgraph hosted service explorer, go to the subgraph edit dashboard (https://thegraph.com/hosted-service/subgraph/recursive-research/<subgraph-name>/edit),
set 'hide' to disabled, and then click 'update subgraph'.

### Requirements

- [graph-cli](https://thegraph.com/docs/en/developer/quick-start/)
- For testing: [matchstick](https://github.com/LimeChain/matchstick) - there are currently issues with getting this set up on M1 macs

**Also required for local deployment:**

- [IPFS](https://github.com/ipfs/ipfs)
- [postgres](https://gist.github.com/phortuin/2fe698b6c741fd84357cec84219c6667)
- A running [Graph node](https://github.com/graphprotocol/graph-node) instance

### Setting up / running IPFS

`cd $GOPATH/src/github.com && mkdir ipfs && cd ipfs && git clone git@github.com:ipfs/go-ipfs.git`
`make build && sudo mv cmd/ipfs/ipfs /usr/local/bin/`
`ipfs init`
`ipfs daemon &`

### Running a Graph node

`cargo run -p graph-node --release -- --postgres-url postgresql://user:pass@<host-url>:5432/graph-node --ethereum-rpc <goerli | mainnet | aurora>:https://<network>.alchemyapi.io/v2/<network-api-key> --ipfs <ipfs-host-ip>:5001`

## Overview

### networks.json

This file gives network-specific information so that we can deploy to multiple networks without manually changing addresses of dataSources

### schema.graphql

This file defines the entities that compose our queryable subgraph. We can define entities arbitrarily, and don't need to map 1:1 to contracts / events, so we can introduce some cool things here that would help with data analysis in the future.

### subgraph.yaml

This file is known as the subgraph manifest. Here, we define some high-level information about our subgraph. This has a few main sections:

- _schema_: The schema entry points to the graphql schema we defined in the last step, and tells `graph-cli` the structure of the entities we want to create.
- _dataSources_: here we define concrete, static contracts (think factories, etc - anything with a single address that is not created on the fly)
- _address_: for dataSources, we define the address of the contract. This, naturally, is network specific. When we deploy with a specified network, this value is updated to the value specified in `networks.json` for the given dataSource.
- _templates_: these are created dynamically, and this is the main thing that differentiates templates from a _dataSource_, so we don't specify an address for these up front. For us, templates are Vaults, tokens, etc. The following items are common to dataSources and templates
- abis: all ABIs we use in writing our event handlers must be included here, so that code can be generated for interacting with our smart contracts. We pass the name of the generated class and the path to the ABI file.
- _eventHandlers_: we pass the event signature and handler name that are relevant to each entity here (ie `FeeToUpdated(indexed address) -> handleFeeToUpdated`)
- _entities_: any GraphQL entities used in the eventHandlers for a given entity must be specified

### src

This is the code that defines how the indexers actually interact with our entities.

### ABIs

The ABIs of all contracts that are used in `rift-protocol`. We provide these locally to ensure they are up-to-date.

### Build

The output of `yarn build` and `yarn deploy` lives here. Contains JSON ABIs for contracts interacted with, as well as webAssembly files for our event handlers.

### Generated

The output of `yarn codegen` lives here - contains auto-generated code for interacting with our defined entities and contracts.
