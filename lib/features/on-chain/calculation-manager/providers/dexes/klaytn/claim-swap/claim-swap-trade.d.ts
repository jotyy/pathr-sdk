import { OnChainTradeType } from '../../../common/models/on-chain-trade-type';
import { UniswapV2AbstractTrade } from '../../common/uniswap-v2-abstract/uniswap-v2-abstract-trade';
export declare class ClaimSwapTrade extends UniswapV2AbstractTrade {
    static readonly contractAbi: import("web3-utils").AbiItem[];
    static readonly swapMethods: import("../../common/uniswap-v2-abstract/constants/SWAP_METHOD").ExactInputOutputSwapMethodsList;
    static get type(): OnChainTradeType;
    readonly dexContractAddress = "0xEf71750C100f7918d6Ded239Ff1CF09E81dEA92D";
}
