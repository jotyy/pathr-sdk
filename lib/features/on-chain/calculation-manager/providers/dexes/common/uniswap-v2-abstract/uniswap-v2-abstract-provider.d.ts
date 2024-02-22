import BigNumber from 'bignumber.js';
import { PriceToken, PriceTokenAmount } from 'src/common/tokens';
import { EvmBlockchainName } from 'src/core/blockchain/models/blockchain-name';
import { OnChainCalculationOptions } from 'src/features/on-chain/calculation-manager/providers/common/models/on-chain-calculation-options';
import { OnChainProxyFeeInfo } from 'src/features/on-chain/calculation-manager/providers/common/models/on-chain-proxy-fee-info';
import { OnChainTradeType } from 'src/features/on-chain/calculation-manager/providers/common/models/on-chain-trade-type';
import { Exact } from 'src/features/on-chain/calculation-manager/providers/common/on-chain-trade/evm-on-chain-trade/models/exact';
import { EvmOnChainProvider } from 'src/features/on-chain/calculation-manager/providers/dexes/common/on-chain-provider/evm-on-chain-provider/evm-on-chain-provider';
import { UniswapCalculatedInfo } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/models/uniswap-calculated-info';
import { UniswapV2CalculationOptions } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/models/uniswap-v2-calculation-options';
import { UniswapV2ProviderConfiguration } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/models/uniswap-v2-provider-configuration';
import { UniswapV2TradeClass } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/models/uniswap-v2-trade-class';
import { UniswapV2AbstractTrade } from 'src/features/on-chain/calculation-manager/providers/dexes/common/uniswap-v2-abstract/uniswap-v2-abstract-trade';
export declare abstract class UniswapV2AbstractProvider<T extends UniswapV2AbstractTrade = UniswapV2AbstractTrade> extends EvmOnChainProvider {
    /** @internal */
    abstract readonly UniswapV2TradeClass: UniswapV2TradeClass<T>;
    /** @internal */
    abstract readonly providerSettings: UniswapV2ProviderConfiguration;
    get type(): OnChainTradeType;
    protected readonly defaultOptions: UniswapV2CalculationOptions;
    calculate(from: PriceTokenAmount<EvmBlockchainName>, to: PriceToken<EvmBlockchainName>, options?: OnChainCalculationOptions): Promise<UniswapV2AbstractTrade>;
    /**
     * Calculates trade, based on amount, user wants to get.
     * @param from Token to sell.
     * @param to Token to get with output amount.
     * @param options Additional options.
     */
    calculateExactOutput(from: PriceToken<EvmBlockchainName>, to: PriceTokenAmount<EvmBlockchainName>, options?: OnChainCalculationOptions): Promise<UniswapV2AbstractTrade>;
    /**
     * Calculates input amount, based on amount, user wants to get.
     * @param from Token to sell.
     * @param to Token to get with output amount.
     * @param options Additional options.
     */
    calculateExactOutputAmount(from: PriceToken<EvmBlockchainName>, to: PriceTokenAmount<EvmBlockchainName>, options?: OnChainCalculationOptions): Promise<BigNumber>;
    /**
     * Calculates on-chain trade.
     * @param fromToken Token to sell.
     * @param toToken Token to get.
     * @param weiAmount Amount to sell or to get in wei.
     * @param exact Defines, whether to call 'exactInput' or 'exactOutput' method.
     * @param options Additional options.
     */
    calculateDifficultTrade(fromToken: PriceToken<EvmBlockchainName>, toToken: PriceToken<EvmBlockchainName>, weiAmount: BigNumber, exact: Exact, options?: OnChainCalculationOptions): Promise<UniswapV2AbstractTrade>;
    protected getAmountAndPath(from: PriceToken<EvmBlockchainName>, to: PriceToken<EvmBlockchainName>, weiAmount: BigNumber, exact: Exact, options: UniswapV2CalculationOptions, proxyFeeInfo: OnChainProxyFeeInfo | undefined, gasPriceInUsd: BigNumber | undefined): Promise<UniswapCalculatedInfo>;
}
