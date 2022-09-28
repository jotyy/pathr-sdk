import { BLOCKCHAIN_NAME } from 'src/core';
import { rubicCrossChainRouterAddress } from 'src/features/cross-chain/constants/rubic-cross-chain-router-address';
import { UniversalContract } from '../../common/models/universal-contract';
import { RangoCrossChainSupportedBlockchain } from './rango-cross-chain-supported-blockchain';

export const RANGO_CONTRACT_ADDRESSES: Record<
    RangoCrossChainSupportedBlockchain,
    UniversalContract
> = {
    [BLOCKCHAIN_NAME.POLYGON]: {
        providerGateway: '0x38F7Aa5370439E879370E24AdD063a11Bd74610D',
        providerRouter: '0x38F7Aa5370439E879370E24AdD063a11Bd74610D',
        rubicRouter: rubicCrossChainRouterAddress
    },
    [BLOCKCHAIN_NAME.ETHEREUM]: {
        providerGateway: '0x0e3EB2eAB0e524b69C79E24910f4318dB46bAa9c',
        providerRouter: '0x0e3EB2eAB0e524b69C79E24910f4318dB46bAa9c',
        rubicRouter: rubicCrossChainRouterAddress
    },
    [BLOCKCHAIN_NAME.AVALANCHE]: {
        providerGateway: '0xc4300bE7878F42B39Bdfb6A57D0f88eB87b842C3',
        providerRouter: '0xc4300bE7878F42B39Bdfb6A57D0f88eB87b842C3',
        rubicRouter: rubicCrossChainRouterAddress
    },
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
        providerGateway: '0x2a7813412b8da8d18Ce56FE763B9eb264D8e28a8',
        providerRouter: '0x2a7813412b8da8d18Ce56FE763B9eb264D8e28a8',
        rubicRouter: rubicCrossChainRouterAddress
    },
    [BLOCKCHAIN_NAME.FANTOM]: {
        providerGateway: '0x2a7813412b8da8d18Ce56FE763B9eb264D8e28a8',
        providerRouter: '0x2a7813412b8da8d18Ce56FE763B9eb264D8e28a8',
        rubicRouter: rubicCrossChainRouterAddress
    },
    [BLOCKCHAIN_NAME.ARBITRUM]: {
        providerGateway: '0x0e3EB2eAB0e524b69C79E24910f4318dB46bAa9c',
        providerRouter: '0x0e3EB2eAB0e524b69C79E24910f4318dB46bAa9c',
        rubicRouter: rubicCrossChainRouterAddress
    },
    [BLOCKCHAIN_NAME.OPTIMISM]: {
        providerGateway: '0x0e3EB2eAB0e524b69C79E24910f4318dB46bAa9c',
        providerRouter: '0x0e3EB2eAB0e524b69C79E24910f4318dB46bAa9c',
        rubicRouter: rubicCrossChainRouterAddress
    }
};
