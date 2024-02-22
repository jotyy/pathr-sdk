import { UniswapV3RouterConfiguration } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v3-abstract/models/uniswap-v3-router-configuration';
/**
 * Most popular tokens in uni v3 to use in a route.
 */
declare const tokensSymbols: readonly ["WETH", "USDT", "USDC", "WBTC", "DAI"];
type TokenSymbol = (typeof tokensSymbols)[number];
export declare const UNI_SWAP_V3_ETHEREUM_POW_ROUTER_CONFIGURATION: UniswapV3RouterConfiguration<TokenSymbol>;
export {};
