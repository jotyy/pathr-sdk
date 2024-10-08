import { PriceToken, PriceTokenAmount } from '../../../../../common/tokens';
import { BlockchainName, EvmBlockchainName } from '../../../../../core/blockchain/models/blockchain-name';
import { RequiredCrossChainOptions } from '../../models/cross-chain-options';
import { CrossChainProvider } from '../common/cross-chain-provider';
import { CalculationResult } from '../common/models/calculation-result';
import { FeeInfo } from '../common/models/fee-info';
import { RubicStep } from '../common/models/rubicStep';
import { XyCrossChainSupportedBlockchain } from './constants/xy-supported-blockchains';
import { XyTransactionResponse } from './models/xy-transaction-response';
export declare class XyCrossChainProvider extends CrossChainProvider {
    static readonly apiEndpoint = "https://open-api.xy.finance/v1";
    readonly type: "xy";
    isSupportedBlockchain(blockchain: BlockchainName): blockchain is XyCrossChainSupportedBlockchain;
    calculate(fromToken: PriceTokenAmount<EvmBlockchainName>, toToken: PriceToken<EvmBlockchainName>, options: RequiredCrossChainOptions): Promise<CalculationResult>;
    protected getFeeInfo(fromBlockchain: XyCrossChainSupportedBlockchain, providerAddress: string, percentFeeToken: PriceTokenAmount, useProxy: boolean): Promise<FeeInfo>;
    private analyzeStatusCode;
    protected getRoutePath(fromToken: PriceTokenAmount, toToken: PriceTokenAmount, quote: XyTransactionResponse['quote']): Promise<RubicStep[]>;
}
