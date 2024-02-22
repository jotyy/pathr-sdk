import { OnChainTradeType } from 'src/features/on-chain/calculation-manager/providers/common/models/on-chain-trade-type';
import { UniswapV2AbstractTrade } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/uniswap-v2-abstract-trade';
export declare class PulseXV2Trade extends UniswapV2AbstractTrade {
    static get type(): OnChainTradeType;
    readonly dexContractAddress = "0x165C3410fC91EF562C50559f7d2289fEbed552d9";
}
