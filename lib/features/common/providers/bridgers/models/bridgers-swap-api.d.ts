import { BridgersSourceFlag } from './bridgers-source-flag';
import { EvmBridgersTransactionData } from '../../../../cross-chain/calculation-manager/providers/bridgers-provider/evm-bridgers-trade/models/evm-bridgers-transaction-data';
import { TronBridgersTransactionData } from '../../../../cross-chain/calculation-manager/providers/bridgers-provider/tron-bridgers-trade/models/tron-bridgers-transaction-data';
export interface BridgersSwapRequest {
    fromTokenAddress: string;
    toTokenAddress: string;
    fromAddress: string;
    toAddress: string;
    fromTokenChain: string;
    toTokenChain: string;
    fromTokenAmount: string;
    amountOutMin: string;
    equipmentNo: string;
    sourceFlag: BridgersSourceFlag;
}
export interface BridgersSwapResponse<T extends EvmBridgersTransactionData | TronBridgersTransactionData> {
    data: {
        txData: T;
    };
}
