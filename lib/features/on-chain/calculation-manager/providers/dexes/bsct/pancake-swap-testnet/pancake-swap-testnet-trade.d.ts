import { OnChainTradeType } from 'src/features/on-chain/calculation-manager/providers/common/models/on-chain-trade-type';
import { UniswapV2AbstractTrade } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/uniswap-v2-abstract-trade';
export declare class PancakeSwapTestnetTrade extends UniswapV2AbstractTrade {
    static get type(): OnChainTradeType;
    readonly dexContractAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
}
