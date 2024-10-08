import BigNumber from 'bignumber.js';
import { PriceTokenAmount } from '../../../../../../common/tokens';
import { BridgersCrossChainSupportedBlockchain } from '../constants/bridgers-cross-chain-supported-blockchain';
import { EvmBridgersTransactionData } from '../evm-bridgers-trade/models/evm-bridgers-transaction-data';
import { TronBridgersTransactionData } from '../tron-bridgers-trade/models/tron-bridgers-transaction-data';
import { GetContractParamsOptions } from '../../common/models/get-contract-params-options';
import { MarkRequired } from 'ts-essentials';
export declare function getMethodArgumentsAndTransactionData<T extends EvmBridgersTransactionData | TronBridgersTransactionData>(from: PriceTokenAmount<BridgersCrossChainSupportedBlockchain>, fromWithoutFee: PriceTokenAmount<BridgersCrossChainSupportedBlockchain>, to: PriceTokenAmount<BridgersCrossChainSupportedBlockchain>, toTokenAmountMin: BigNumber, walletAddress: string, providerAddress: string, options: MarkRequired<GetContractParamsOptions, 'receiverAddress'>): Promise<{
    methodArguments: unknown[];
    transactionData: T;
}>;
