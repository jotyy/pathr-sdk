import BigNumber from 'bignumber.js';
import { PriceTokenAmount } from '../../../../../common/tokens';
import { EvmBlockchainName } from '../../../../../core/blockchain/models/blockchain-name';
import { ContractParams } from '../../../../common/models/contract-params';
import { SwapTransactionOptions } from '../../../../common/models/swap-transaction-options';
import { EvmCrossChainTrade } from '../common/emv-cross-chain-trade/evm-cross-chain-trade';
import { GasData } from '../common/emv-cross-chain-trade/models/gas-data';
import { FeeInfo } from '../common/models/fee-info';
import { GetContractParamsOptions } from '../common/models/get-contract-params-options';
import { RubicStep } from '../common/models/rubicStep';
import { TradeInfo } from '../common/models/trade-info';
import { TransactionRequest } from './models/transaction-request';
import { EvmOnChainTrade } from '../../../../on-chain/calculation-manager/providers/common/on-chain-trade/evm-on-chain-trade/evm-on-chain-trade';
/**
 * Calculated DeBridge cross-chain trade.
 */
export declare class DebridgeCrossChainTrade extends EvmCrossChainTrade {
    protected useProxyByDefault: boolean;
    /** @internal */
    readonly transitAmount: BigNumber;
    readonly maxTheoreticalAmount: BigNumber;
    private readonly cryptoFeeToken;
    private readonly transactionRequest;
    private readonly slippage;
    private readonly onChainTrade;
    /** @internal */
    static getGasData(from: PriceTokenAmount<EvmBlockchainName>, toToken: PriceTokenAmount<EvmBlockchainName>, transactionRequest: TransactionRequest, feeInfo: FeeInfo, providerAddress: string, receiverAddress?: string): Promise<GasData | null>;
    readonly type: "dln";
    readonly isAggregator = false;
    readonly onChainSubtype: {
        from: "ONE_INCH";
        to: "ONE_INCH";
    };
    readonly bridgeType: "dln";
    readonly from: PriceTokenAmount<EvmBlockchainName>;
    readonly to: PriceTokenAmount<EvmBlockchainName>;
    readonly toTokenAmountMin: BigNumber;
    readonly priceImpact: number | null;
    readonly allowanceTarget: string;
    readonly gasData: GasData | null;
    private get fromBlockchain();
    protected get fromContractAddress(): string;
    readonly feeInfo: FeeInfo;
    protected get methodName(): string;
    constructor(crossChainTrade: {
        from: PriceTokenAmount<EvmBlockchainName>;
        to: PriceTokenAmount<EvmBlockchainName>;
        transactionRequest: TransactionRequest;
        gasData: GasData | null;
        priceImpact: number | null;
        allowanceTarget: string;
        slippage: number;
        feeInfo: FeeInfo;
        transitAmount: BigNumber;
        toTokenAmountMin: BigNumber;
        maxTheoreticalAmount: BigNumber;
        cryptoFeeToken: PriceTokenAmount;
        onChainTrade: EvmOnChainTrade | null;
    }, providerAddress: string, routePath: RubicStep[]);
    protected swapDirect(options?: SwapTransactionOptions): Promise<string | never>;
    getContractParams(options: GetContractParamsOptions, skipAmountChangeCheck?: boolean): Promise<ContractParams>;
    private getTransactionRequest;
    getTradeInfo(): TradeInfo;
    getTradeAmountRatio(fromUsd: BigNumber): BigNumber;
    getUsdPrice(providerFeeToken?: BigNumber): BigNumber;
}
