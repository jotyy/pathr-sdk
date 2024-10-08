import { BLOCKCHAIN_NAME } from 'src/core/blockchain/models/blockchain-name';

export const xySupportedBlockchains = [
    BLOCKCHAIN_NAME.ETHEREUM,
    BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
    BLOCKCHAIN_NAME.POLYGON,
    BLOCKCHAIN_NAME.FANTOM,
    BLOCKCHAIN_NAME.CRONOS,
    // BLOCKCHAIN_NAME.THUNDER_CORE
    BLOCKCHAIN_NAME.AVALANCHE,
    // BLOCKCHAIN_NAME.KUCOIN
    BLOCKCHAIN_NAME.ARBITRUM,
    BLOCKCHAIN_NAME.OPTIMISM,
    BLOCKCHAIN_NAME.ASTAR_EVM,
    BLOCKCHAIN_NAME.MOONRIVER,
    BLOCKCHAIN_NAME.ZK_SYNC,
    // BLOCKCHAIN_NAME.KLAYTN
    BLOCKCHAIN_NAME.POLYGON_ZKEVM,
    BLOCKCHAIN_NAME.LINEA,
    BLOCKCHAIN_NAME.BASE,
    BLOCKCHAIN_NAME.SCROLL
] as const;

export type XyCrossChainSupportedBlockchain = (typeof xySupportedBlockchains)[number];
