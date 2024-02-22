import BigNumber from 'bignumber.js';
import { BytesLike } from 'ethers';
import { PriceToken, PriceTokenAmount } from "../../../../../common/tokens";
import { EvmBlockchainName } from "../../../../../core/blockchain/models/blockchain-name";
import { EvmEncodeConfig } from "../../../../../core/blockchain/web3-pure/typed-web3-pure/evm-web3-pure/models/evm-encode-config";
import { ContractParams } from "../../../../common/models/contract-params";
import { SwapTransactionOptions } from "../../../../common/models/swap-transaction-options";
import { EvmCrossChainTrade } from "../common/emv-cross-chain-trade/evm-cross-chain-trade";
import { GasData } from "../common/emv-cross-chain-trade/models/gas-data";
import { FeeInfo } from "../common/models/fee-info";
import { GetContractParamsOptions } from "../common/models/get-contract-params-options";
import { OnChainSubtype } from "../common/models/on-chain-subtype";
import { PathrStep } from "../common/models/pathrStep";
import { TradeInfo } from "../common/models/trade-info";
import { EvmOnChainTrade } from "../../../../on-chain/calculation-manager/providers/common/on-chain-trade/evm-on-chain-trade/evm-on-chain-trade";
import { StargateCrossChainSupportedBlockchain } from './constants/stargate-cross-chain-supported-blockchain';
export declare class StargateCrossChainTrade extends EvmCrossChainTrade {
    protected get methodName(): string;
    /**  @internal */
    static getGasData(from: PriceTokenAmount<EvmBlockchainName>, toToken: PriceTokenAmount<EvmBlockchainName>, feeInfo: FeeInfo, srcChainTrade: EvmOnChainTrade | null, dstChainTrade: EvmOnChainTrade | null, slippageTolerance: number, providerAddress: string, receiverAddress?: string): Promise<GasData | null>;
    readonly feeInfo: FeeInfo;
    readonly type: "stargate";
    readonly isAggregator = false;
    readonly from: PriceTokenAmount<EvmBlockchainName>;
    readonly to: PriceTokenAmount<EvmBlockchainName>;
    readonly slippageTolerance: number;
    readonly gasData: GasData;
    readonly priceImpact: number | null;
    readonly toTokenAmountMin: BigNumber;
    readonly onChainSubtype: OnChainSubtype;
    readonly bridgeType: "stargate";
    get fromBlockchain(): StargateCrossChainSupportedBlockchain;
    protected get fromContractAddress(): string;
    private readonly onChainTrade;
    private readonly dstChainTrade;
    private readonly cryptoFeeToken;
    constructor(crossChainTrade: {
        from: PriceTokenAmount<EvmBlockchainName>;
        to: PriceTokenAmount<EvmBlockchainName>;
        slippageTolerance: number;
        priceImpact: number | null;
        gasData: GasData | null;
        feeInfo: FeeInfo;
        srcChainTrade: EvmOnChainTrade | null;
        dstChainTrade: EvmOnChainTrade | null;
        cryptoFeeToken: PriceToken | null;
    }, providerAddress: string, routePath: PathrStep[]);
    protected swapDirect(options?: SwapTransactionOptions): Promise<string | never>;
    static getLayerZeroSwapData(from: PriceTokenAmount<EvmBlockchainName>, to: PriceTokenAmount<EvmBlockchainName>, tokenAmountMin?: string, receiverAddress?: string, dstData?: string): Promise<EvmEncodeConfig>;
    getContractParams(options: GetContractParamsOptions): Promise<ContractParams>;
    getTradeAmountRatio(fromUsd: BigNumber): BigNumber;
    getTradeInfo(): TradeInfo;
    protected checkProviderIsWhitelisted(_providerRouter: string, _providerGateway?: string): Promise<void>;
    protected getProviderData(_sourceData: BytesLike, dstSwapData?: string, receiverAddress?: string): unknown[];
}
