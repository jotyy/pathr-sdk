import BigNumber from 'bignumber.js';
import { PriceTokenAmount } from '../../../../../common/tokens';
import { EvmBlockchainName } from '../../../../../core/blockchain/models/blockchain-name';
import { ContractParams } from '../../../../common/models/contract-params';
import { SwapTransactionOptions } from '../../../../common/models/swap-transaction-options';
import { EvmCrossChainTrade } from '../common/emv-cross-chain-trade/evm-cross-chain-trade';
import { GasData } from '../common/emv-cross-chain-trade/models/gas-data';
import { FeeInfo } from '../common/models/fee-info';
import { GetContractParamsOptions } from '../common/models/get-contract-params-options';
import { OnChainSubtype } from '../common/models/on-chain-subtype';
import { RubicStep } from '../common/models/rubicStep';
import { TradeInfo } from '../common/models/trade-info';
import { EvmOnChainTrade } from '../../../../on-chain/calculation-manager/providers/common/on-chain-trade/evm-on-chain-trade/evm-on-chain-trade';
export declare class CbridgeCrossChainTrade extends EvmCrossChainTrade {
    /** @internal */
    static getGasData(from: PriceTokenAmount<EvmBlockchainName>, toToken: PriceTokenAmount<EvmBlockchainName>, onChainTrade: EvmOnChainTrade | null, feeInfo: FeeInfo, maxSlippage: number, celerContractAddress: string, providerAddress: string, receiverAddress: string): Promise<GasData | null>;
    readonly type: "celer_bridge";
    readonly isAggregator = false;
    readonly bridgeType: "celer_bridge";
    readonly from: PriceTokenAmount<EvmBlockchainName>;
    readonly to: PriceTokenAmount<EvmBlockchainName>;
    readonly toTokenAmountMin: BigNumber;
    readonly priceImpact: number | null;
    readonly gasData: GasData | null;
    private get fromBlockchain();
    protected get fromContractAddress(): string;
    readonly feeInfo: FeeInfo;
    private readonly slippage;
    private readonly maxSlippage;
    private readonly celerContractAddress;
    readonly onChainSubtype: OnChainSubtype;
    readonly onChainTrade: EvmOnChainTrade | null;
    protected get methodName(): string;
    constructor(crossChainTrade: {
        from: PriceTokenAmount<EvmBlockchainName>;
        to: PriceTokenAmount<EvmBlockchainName>;
        gasData: GasData | null;
        priceImpact: number | null;
        slippage: number;
        feeInfo: FeeInfo;
        maxSlippage: number;
        contractAddress: string;
        transitMinAmount: BigNumber;
        onChainTrade: EvmOnChainTrade | null;
    }, providerAddress: string, routePath: RubicStep[]);
    protected swapDirect(options?: SwapTransactionOptions): Promise<string | never>;
    getContractParams(options: GetContractParamsOptions): Promise<ContractParams>;
    getTradeAmountRatio(fromUsd: BigNumber): BigNumber;
    getTradeInfo(): TradeInfo;
    private getTransactionRequest;
}
