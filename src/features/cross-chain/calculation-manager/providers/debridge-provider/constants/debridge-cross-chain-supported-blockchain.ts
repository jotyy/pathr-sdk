import { BLOCKCHAIN_NAME } from 'src/core/blockchain/models/blockchain-name';

export const deBridgeCrossChainSupportedBlockchains = [
    BLOCKCHAIN_NAME.ETHEREUM,
    BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
    BLOCKCHAIN_NAME.POLYGON,
    BLOCKCHAIN_NAME.ARBITRUM,
    BLOCKCHAIN_NAME.AVALANCHE,
    BLOCKCHAIN_NAME.LINEA,
    BLOCKCHAIN_NAME.OPTIMISM,
    BLOCKCHAIN_NAME.BASE
] as const;

export type DeBridgeCrossChainSupportedBlockchain =
    (typeof deBridgeCrossChainSupportedBlockchains)[number];
