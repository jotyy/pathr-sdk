import { OolongSwapTrade } from 'src/features/on-chain/calculation-manager/providers/dexes/boba/oolong-swap/oolong-swap-trade';
import { UniswapV2AbstractProvider } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/uniswap-v2-abstract-provider';
export declare class OolongSwapProvider extends UniswapV2AbstractProvider<OolongSwapTrade> {
    readonly blockchain: "BOBA";
    readonly UniswapV2TradeClass: typeof OolongSwapTrade;
    readonly providerSettings: import("../../common/uniswap-v2-abstract/models/uniswap-v2-provider-configuration").UniswapV2ProviderConfiguration;
}
